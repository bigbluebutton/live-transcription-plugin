import * as React from 'react';
import { ReactNode, useEffect } from 'react';
import * as ReactDOM from 'react-dom/client';
import { BbbPluginSdk, GenericContentSidekickArea } from 'bigbluebutton-html-plugin-sdk';
import { GET_CAPTION_ACTIVE_LOCALES } from './queries';
import { CaptionActiveLocaleGraphqlResponse, LiveTranscriptionPluginProps } from './types';
import { LiveTranscriptionSidekickContent } from '../sidekick-content/component';

export function LiveTranscriptionPlugin(
  { pluginUuid: uuid }: LiveTranscriptionPluginProps,
): ReactNode {
  BbbPluginSdk.initialize(uuid);
  const pluginApi = BbbPluginSdk.getPluginApi(uuid);

  const { data: captionActiveLocalesResult } = pluginApi.useCustomSubscription<
  CaptionActiveLocaleGraphqlResponse>(
    GET_CAPTION_ACTIVE_LOCALES,
  );

  useEffect(() => {
    if (captionActiveLocalesResult) {
      const sidekickPanelsList = captionActiveLocalesResult.caption_activeLocales.map(
        (activeCaptionLocale) => new GenericContentSidekickArea({
          name: `Live Transcription (${activeCaptionLocale.locale})`,
          buttonIcon: 'closed_caption',
          section: 'Captions',
          open: false,
          contentFunction: (element: HTMLElement) => {
            const root = ReactDOM.createRoot(element);
            root.render(
              (<LiveTranscriptionSidekickContent
                captionLocale={activeCaptionLocale.locale}
                pluginApi={pluginApi}
              />),
            );
            return root;
          },
        }),
      );
      pluginApi.setGenericContentItems([...sidekickPanelsList]);
    }
  }, [captionActiveLocalesResult]);

  return null;
}
