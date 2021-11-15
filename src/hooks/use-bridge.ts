import { useCreation, usePersistFn } from 'ahooks';
import constate from 'constate';
import { useState } from 'react';
import { fromByteArray } from 'base64-js';
import iconv from 'iconv-lite';
import { chunk, padStart } from 'lodash-es';

type BridgeEnv = 'via' | 'alook' | undefined;

const toBase64 = (str: string) =>
  fromByteArray(
    Buffer.from(
      chunk(
        Array.from(iconv.encode(str, 'UTF-16BE').values()).map((v) =>
          padStart(v.toString(16), 2, 'e'),
        ),
        2,
      )
        .map(([a, b]) => `\\\\u${a}${b}`)
        .join(''),
    ),
  );

export const [BridgeProvider, useBridge] = constate(() => {
  const bridgeEnv = useCreation<BridgeEnv>(() => {
    switch (true) {
      case !!window.via:
        return 'via';
      case !!window.alook:
        return 'alook';
      default:
        return undefined;
    }
  }, []);

  const [installedAddonID, setInstalledAddonID] = useState<string[]>([]);

  const getInstalledAddonID = usePersistFn((): string[] => {
    let id: string[] = [];
    try {
      switch (bridgeEnv) {
        case 'via':
          id = JSON.parse(window.via?.getInstalledAddonID() ?? '[]');
          break;
        default:
          id = [];
          break;
      }
    } catch (error) {
      console.error(error);
    }
    setInstalledAddonID(id);
    return id;
  });

  const installAddon = usePersistFn(
    (data: {
      id: string;
      name: string;
      author: string;
      url: string;
      code: string;
    }) => {
      try {
        switch (bridgeEnv) {
          case 'via':
            window.via?.addon(
              toBase64(
                JSON.stringify({
                  ...data,
                  code: toBase64(data.code),
                }),
              ),
            );
            break;
          default:
            return false;
        }
        return true;
      } catch (error) {
        return false;
      }
    },
  );

  return {
    bridgeEnv,
    installedAddonID,
    getInstalledAddonID,
    installAddon,
  };
});
