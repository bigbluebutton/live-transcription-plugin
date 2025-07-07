export interface LiveTranscriptionPluginProps {
  pluginUuid: string;
}

export interface CaptionActiveLocaleGraphqlResponse {
  caption_activeLocales: {
    locale: string;
  }[];
}

export interface CaptionSettingsGraphqlResponse {
  meeting: {
    disabledFeatures: string[];
    captionSettings: {
      audioCaptionEnabled: boolean;
      audioCaptionAvailableLanguages: string[];
    }
  }[]
}
