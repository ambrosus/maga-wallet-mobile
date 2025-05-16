import { useMemo } from 'react';
import { toLower } from 'lodash';
import {
  AirdaoWhiteIcon,
  AirdaoBlueIcon,
  KosmosTokenIcon,
  AirDOGEIcon,
  EthTokenIcon,
  BusdIcon,
  UsdcIcon,
  TetherIcon,
  ASTIcon,
  HBRIcon,
  TokenXENAIcon,
  TokenSwineIcon,
  TokenMAGAIcon,
  UnknownTokenIcon,
  AirBondIcon
} from '@components/svgs/tokens';
import { CryptoCurrencyCode } from '@constants';
import { useRodeoSingleTokenQuery } from '@lib/hooks/queries';
import { fromHexlifyToObject, getTokenNameFromDatabase } from '@utils';
import { TokenImageIpfsWithShimmer } from '../token-ipfs-image-with-shimmer';

interface TokenLogoProps {
  token?: string;
  scale?: number;
  isNativeCoin?: boolean | string;
  address?: string;
  overrideIconVariants?: {
    amb?: 'white' | 'blue';
    eth?: 'gray' | 'blue';
  };
}

export const TokenLogo = ({
  scale = 1,
  token,
  address,
  overrideIconVariants = { amb: 'blue', eth: 'gray' }
}: TokenLogoProps) => {
  const tokenName = useMemo(() => {
    if (address) return getTokenNameFromDatabase(address);
    else return token;
  }, [address, token]);

  const { data, loading } = useRodeoSingleTokenQuery(tokenName);

  switch (toLower(tokenName)) {
    case CryptoCurrencyCode.AMB.toLowerCase():
    case CryptoCurrencyCode.SAMB.toLowerCase():
    case CryptoCurrencyCode.CollateralizedHarbor.toLowerCase():
    case CryptoCurrencyCode.SyntheticAmber.toLowerCase():
    case CryptoCurrencyCode.Test1.toLowerCase():
    case CryptoCurrencyCode.stAMB.toLowerCase():
    case CryptoCurrencyCode.StAMB.toLowerCase():
    case 'staked amb':
    case 'airdao': {
      if (overrideIconVariants.amb === 'white') {
        return <AirdaoWhiteIcon scale={scale} />;
      }
      return <AirdaoBlueIcon scale={scale} />;
    }
    case CryptoCurrencyCode.KOS.toLowerCase():
      return <KosmosTokenIcon scale={scale} />;
    case CryptoCurrencyCode.ADOGE.toLowerCase():
    case CryptoCurrencyCode.Airdoge.toLowerCase():
      return <AirDOGEIcon scale={scale} />;
    case CryptoCurrencyCode.ETH.toLowerCase():
    case 'ethereum':
    case 'weth':
    case 'wrapped ether':
      return (
        <EthTokenIcon scale={scale} fillColor={overrideIconVariants.eth} />
      );
    case CryptoCurrencyCode.BUSD.toLowerCase():
    case 'busd token':
    case 'wbnb':
    case 'wrapped bnb':
    case 'bsc':
      return <BusdIcon scale={scale} />;
    case CryptoCurrencyCode.USDC.toLowerCase():
    case 'usd coin':
      return <UsdcIcon scale={scale} />;
    case CryptoCurrencyCode.Tether.toLowerCase():
    case 'tether usd':
      return <TetherIcon scale={scale} />;
    case CryptoCurrencyCode.ASTLP.toLowerCase():
    case CryptoCurrencyCode.AstraLiquidityPool.toLowerCase():
    case CryptoCurrencyCode.AST.toLowerCase():
    case CryptoCurrencyCode.Astra.toLowerCase():
      return <ASTIcon scale={scale} />;
    case CryptoCurrencyCode.Harbor.toLowerCase():
    case CryptoCurrencyCode.HBR.toLowerCase():
      return <HBRIcon scale={scale} />;
    case CryptoCurrencyCode.KosmosToken.toLowerCase():
    case 'kos':
      return <KosmosTokenIcon scale={scale} />;
    case CryptoCurrencyCode.XENA.toLowerCase():
      return <TokenXENAIcon scale={scale} />;
    case CryptoCurrencyCode.Swine.toLowerCase():
      return <TokenSwineIcon scale={scale} />;
    case CryptoCurrencyCode.MAGA.toLowerCase():
    case 'MAKE AIRDAO GREAT AGAIN'.toLowerCase():
      return <TokenMAGAIcon scale={scale} />;
    case CryptoCurrencyCode.Bond.toLowerCase():
    case 'airbond':
      return <AirBondIcon scale={scale} />;
    default: {
      if (loading) {
        return <TokenImageIpfsWithShimmer src="" loading />;
      }

      if (data && data.token) {
        const {
          token: { data: tokenEncodedData }
        } = data;

        const decodedTokenData = data.token
          ? fromHexlifyToObject<{ image?: string }>(tokenEncodedData)
          : null;

        return (
          <TokenImageIpfsWithShimmer
            src={decodedTokenData?.image ?? ''}
            scale={scale}
          />
        );
      }

      return <UnknownTokenIcon scale={scale} />;
    }
  }
};
