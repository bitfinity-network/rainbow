import { AccentColorProvider } from '@/design-system';
import React, { useCallback } from 'react';
import { useAccountAccentColor } from '@/hooks/useAccountAccentColor';
import { TintButton } from '@/components/cards/reusables/TintButton';
import { getCachedProviderForNetwork, isHardHat } from '@/handlers/web3';
import { useAccountSettings } from '@/hooks';
import { RainbowAddressAssets } from '@/resources/assets/types';
import { useQueryClient } from '@tanstack/react-query';
import { ParsedAddressAsset } from '@/entities';
import { userAssetsQueryKey } from '@/resources/assets/UserAssetsQuery';
import { Network } from '@/networks/types';
import { useSortedUserAssets } from '@/resources/assets/useSortedUserAssets';

export const ADD_TOKEN_BUTTON_HEIGHT = 40;

const tokens: ParsedAddressAsset[] = [
  {
    address: '0x6970852942517f40aa98867De9B3D61d830Efe1c',
    name: 'THXC V1',
    symbol: 'THXCV1',
    decimals: 18,
    uniqueId: '0x6970852942517f40aa98867De9B3D61d830Efe1c',
    network: Network.bitfinity,
  },
  {
    address: '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599',
    name: 'Wrapped BTC',
    symbol: 'WBTC',
    decimals: 8,
    uniqueId: '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599',
    network: Network.mainnet,
  },
  {
    address: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
    name: 'Tether USD',
    symbol: 'USDT',
    decimals: 6,
    uniqueId: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
    network: Network.mainnet,
  },
  {
    address: '0xB8c77482e45F1F44dE1745F52C74426C631bDD52',
    name: 'BNB',
    symbol: 'BNB',
    decimals: 18,
    uniqueId: '0xB8c77482e45F1F44dE1745F52C74426C631bDD52',
    network: Network.mainnet,
  },
];

export const AddTokenButton = () => {
  const { accentColor } = useAccountAccentColor();

  const queryClient = useQueryClient();
  const { data: sortedAssets = [] } = useSortedUserAssets();

  const { accountAddress: address, nativeCurrency: currency, network: currentNetwork } = useAccountSettings();
  const provider = getCachedProviderForNetwork(currentNetwork);
  const providerUrl = provider?.connection?.url;
  const connectedToHardhat = isHardHat(providerUrl);

  const handlePress = useCallback(() => {
    let token: ParsedAddressAsset | undefined;
    for (const tokenEntry of tokens) {
      const existingAsset = sortedAssets.find(s => s.address === tokenEntry.address);
      if (!existingAsset) {
        token = tokenEntry;
        break;
      }
    }

    if (token) {
      const queryKey = userAssetsQueryKey({ address, currency, connectedToHardhat });
      queryClient.setQueryData<RainbowAddressAssets>(queryKey, old => {
        const newData = old ? { ...old } : undefined;
        if (newData && token) {
          newData[token.address] = token!;
        }
        return newData;
      });
    }
  }, [queryClient, address, connectedToHardhat, currency, sortedAssets]);

  return (
    <AccentColorProvider color={accentColor}>
      <TintButton height={ADD_TOKEN_BUTTON_HEIGHT} onPress={handlePress} width={163}>
        Add Token
      </TintButton>
    </AccentColorProvider>
  );
};
