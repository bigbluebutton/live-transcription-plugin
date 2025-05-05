import { PluginApi } from 'bigbluebutton-html-plugin-sdk';
import { IntlShape } from 'react-intl';

export interface LiveTranscriptionSidekickContentProps {
  pluginApi: PluginApi;
  captionLocale: string;
  intl: IntlShape;
}

export interface CaptionGraphqlResult {
  caption_persistent: {
    user: {
      avatar: string;
      color: string;
      name: string;
    }
    captionText: string;
    captionId: string;
    createdAt: string;
  }[];
}

export interface CaptionRowProps {
  hasMarginBottom: boolean;
}

export interface ModalAvatarProps {
  background: string;
}
