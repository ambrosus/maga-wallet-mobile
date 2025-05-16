import { View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { SafeViewContainer } from '@components/atoms';
import { Header } from '@components/molecules';
import { ArrowWithTail } from '@components/svgs';
import { SwapReviewTokenItem } from '@core/dex/components/atoms';
import { PreviewInformation } from '@core/dex/components/molecules';
import { SubmitSwapActions } from '@core/dex/components/organisms';
import { FIELD } from '@core/dex/types';
import { styles } from './styles';

export const DexReviewSwapScreen = () => {
  const { t } = useTranslation();

  return (
    <SafeViewContainer>
      <Header title={t('buttons.review')} />

      <View style={styles.container}>
        <View>
          <View style={styles.preview}>
            <SwapReviewTokenItem type={FIELD.TOKEN_A} />
            <ArrowWithTail orientation="down" />
            <SwapReviewTokenItem type={FIELD.TOKEN_B} />
          </View>

          <PreviewInformation />
        </View>
        <View style={styles.actionsContainer}>
          <SubmitSwapActions />
        </View>
      </View>
    </SafeViewContainer>
  );
};
