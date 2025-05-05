import { PluginApi } from 'bigbluebutton-html-plugin-sdk';

export interface LiveTranscriptionSidekickContentProps {
  pluginApi: PluginApi;
  captionLocale: string;
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
