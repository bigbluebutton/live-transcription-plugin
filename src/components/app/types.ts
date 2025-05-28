export interface LiveTranscriptionPluginProps {
  pluginUuid: string;
}

export interface CaptionActiveLocaleGraphqlResponse {
  caption_activeLocales: {
    locale: string;
  }[];
}
