import * as React from 'react';
import { ReactNode, useEffect, useState } from 'react';
import * as ReactDOM from 'react-dom/client';
import { createIntl, createIntlCache, defineMessages } from 'react-intl';
import { BbbPluginSdk, GenericContentSidekickArea, pluginLogger } from 'bigbluebutton-html-plugin-sdk';
import { GET_CAPTION_ACTIVE_LOCALES, GET_CAPTION_SETTINGS } from './queries';
import { CaptionActiveLocaleGraphqlResponse, CaptionSettingsGraphqlResponse, LiveTranscriptionPluginProps } from './types';
import { LiveTranscriptionSidekickContent } from '../sidekick-content/component';

const intlMessages = defineMessages({
  sidekickSectionName: {
    id: 'sidekick.section.name',
    description: 'Name of the sidekick panel section',
    defaultMessage: 'Captions',
  },
  sidekickMenuTitle: {
    id: 'sidekick.panel.title',
    description: 'Title of the sidekick panel foreach live-transcription menu ',
    defaultMessage: 'Live Transcription ({0})',
  },
});

const LIVE_TRANSCRIPTION_DISABLED_FEATURE = 'liveTranscription';

const LOCALE_REQUEST_OBJECT = (!process.env.NODE_ENV || process.env.NODE_ENV === 'development')
  ? {
    headers: {
      'ngrok-skip-browser-warning': 'any',
    },
  } : null;

export function LiveTranscriptionPlugin(
  { pluginUuid: uuid }: LiveTranscriptionPluginProps,
): ReactNode {
  BbbPluginSdk.initialize(uuid);
  const pluginApi = BbbPluginSdk.getPluginApi(uuid);

  const {
    messages: localeMessages,
    currentLocale,
    loading: localeMessagesLoading,
  } = pluginApi.useLocaleMessages(LOCALE_REQUEST_OBJECT);

  const cache = createIntlCache();
  const intl = (!localeMessagesLoading && localeMessages) ? createIntl({
    locale: currentLocale,
    messages: localeMessages,
    fallbackOnEmptyString: true,
  }, cache) : null;

  const [permissionToLoad, setPermissionToLoad] = useState(true);

  const { data: captionActiveLocalesResult } = pluginApi.useCustomSubscription<
  CaptionActiveLocaleGraphqlResponse>(
    GET_CAPTION_ACTIVE_LOCALES,
  );

  const { data: captionSettings } = pluginApi.useCustomSubscription<
  CaptionSettingsGraphqlResponse>(
    GET_CAPTION_SETTINGS,
  );

  useEffect(() => {
    if (captionActiveLocalesResult && intl && permissionToLoad) {
      const sidekickPanelsList = captionActiveLocalesResult.caption_activeLocales.map(
        (activeCaptionLocale) => new GenericContentSidekickArea({
          name: intl.formatMessage(intlMessages.sidekickMenuTitle, {
            0: activeCaptionLocale.locale,
          }),
          buttonIcon: 'closed_caption',
          section: intl.formatMessage(intlMessages.sidekickSectionName),
          open: false,
          contentFunction: (element: HTMLElement) => {
            const root = ReactDOM.createRoot(element);
            root.render(
              (<LiveTranscriptionSidekickContent
                captionLocale={activeCaptionLocale.locale}
                pluginApi={pluginApi}
                intl={intl}
              />),
            );
            return root;
          },
        }),
      );
      pluginApi.setGenericContentItems([...sidekickPanelsList]);
    }
  }, [captionActiveLocalesResult, intl, permissionToLoad]);

  useEffect(() => {
    if (captionSettings && captionSettings.meeting.length >= 0) {
      const liveTranscriptionDisabled = captionSettings.meeting[0].disabledFeatures.includes(
        LIVE_TRANSCRIPTION_DISABLED_FEATURE,
      );
      const captionEnabled = captionSettings.meeting[0].captionSettings.audioCaptionEnabled
        && captionSettings.meeting[0].captionSettings.audioCaptionAvailableLanguages.length >= 0;

      if (!captionEnabled || liveTranscriptionDisabled) setPermissionToLoad(false);

      const errorMessage = 'Plugin live-transcription will not work';
      if (liveTranscriptionDisabled) {
        pluginLogger.warn(`${errorMessage} because disabled-features contains liveTranscription`);
      }
      if (!captionEnabled) {
        pluginLogger.warn(
          `${errorMessage} because settings audioCaptions is not enabled or doesn't contain a list of available caption language`,
        );
      }
    }
  }, [captionSettings]);

  return null;
}
