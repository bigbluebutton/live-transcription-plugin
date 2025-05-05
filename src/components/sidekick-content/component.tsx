import {
  ReactNode, useEffect, useRef, useState,
} from 'react';
import * as React from 'react';
import { defineMessages } from 'react-intl';
import * as Styled from './styles';
import { CaptionGraphqlResult, LiveTranscriptionSidekickContentProps } from './types';
import { GET_CAPTIONS } from './queries';

const intlMessages = defineMessages({
  downloadButtonLabel: {
    id: 'sidekick.panel.downloadButton.label',
    description: 'Label for the download button',
  },
  scrollButtonLabel: {
    id: 'sidekick.panel.scrollButton.label',
    description: 'Label for the "Scroll to latest" button',
  },
  avatarAlternativeText: {
    id: 'sidekick.panel.avatar.alternativeText',
    description: 'Alternative text for avatar image',
  },
});

export function LiveTranscriptionSidekickContent(
  { pluginApi, captionLocale: locale, intl }: LiveTranscriptionSidekickContentProps,
): ReactNode {
  const { data: captions } = pluginApi.useCustomSubscription
    ? pluginApi.useCustomSubscription<CaptionGraphqlResult>(GET_CAPTIONS, {
      variables: {
        locale,
      },
    })
    : { data: null };

  const containerRef = useRef<HTMLDivElement>(null);
  const [isAtBottom, setIsAtBottom] = useState(true);

  const scrollToBottom = () => {
    const container = containerRef.current;
    if (container) {
      container.scrollTop = container.scrollHeight;
    }
  };

  useEffect(() => {
    if (isAtBottom) {
      scrollToBottom();
    }
  }, [captions]);

  const handleScroll = () => {
    const container = containerRef.current;
    if (!container) return;

    const nearBottom = container.scrollHeight - container.scrollTop <= container.clientHeight + 50;
    setIsAtBottom(nearBottom);
  };

  const downloadLiveTranscription = () => {
    if (!captions?.caption_history) return;

    const formatDate = (isoDate: string) => {
      const date = new Date(isoDate);
      return date;
    };

    const textContent = captions.caption_history.map((c) => {
      const timestamp = formatDate(c.createdAt);
      return `${c.user.name} (${timestamp}): ${c.captionText}`;
    }).join('\n');

    const blob = new Blob([textContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'captions.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const captionsLength = captions?.caption_history ? captions?.caption_history.length : 0;
  return (
    <Styled.Container>
      <Styled.Header>
        <Styled.HeaderTitle>{locale}</Styled.HeaderTitle>
        <Styled.DownloadButton type="button" onClick={downloadLiveTranscription}>
          {intl.formatMessage(intlMessages.downloadButtonLabel)}
        </Styled.DownloadButton>
      </Styled.Header>
      <Styled.ScrollAreaWrapper>
        <Styled.ScrollArea ref={containerRef} onScroll={handleScroll}>
          {captions?.caption_history?.map((c, index) => (
            <Styled.CaptionRow
              hasMarginBottom={index !== captionsLength - 1}
              key={c.captionId}
            >
              <Styled.UserHeader>
                <Styled.UserInfo>
                  {c.user.avatar && c.user.avatar !== '' ? (
                    <Styled.UserAvatarImage
                      alt={intl.formatMessage(
                        intlMessages.avatarAlternativeText,
                        {
                          0: c.user.name,
                        },
                      )}
                      src={c.user.avatar}
                    />
                  ) : (
                    <Styled.UserAvatarInitials background={c.user?.color}>
                      {c.user.name.slice(0, 2)}
                    </Styled.UserAvatarInitials>
                  )}
                  <Styled.UserName>{c.user.name}</Styled.UserName>
                </Styled.UserInfo>

                <Styled.Timestamp>
                  {new Date(c.createdAt).toLocaleTimeString()}
                </Styled.Timestamp>
              </Styled.UserHeader>

              <Styled.CaptionContent>
                <Styled.CaptionText>{c.captionText}</Styled.CaptionText>
              </Styled.CaptionContent>
            </Styled.CaptionRow>
          ))}
        </Styled.ScrollArea>
      </Styled.ScrollAreaWrapper>

      {!isAtBottom && (
        <Styled.ScrollButton type="button" onClick={scrollToBottom}>
          {intl.formatMessage(intlMessages.scrollButtonLabel)}
        </Styled.ScrollButton>
      )}
    </Styled.Container>
  );
}
