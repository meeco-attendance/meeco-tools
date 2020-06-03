/* global chrome */
import React, { useState, useEffect, useCallback } from "react";
import {
  Toggle,
  Stack,
  Text,
  TextField,
  TooltipHost,
  DirectionalHint,
  IconButton,
  Link,
  MessageBar,
  MessageBarType,
} from "@fluentui/react";

const stackTokens = { childrenGap: 8 };

const Settings = () => {
  const [settings, setSettings] = useState({});
  const [showSavedMessage, setShowSavedMessage] = useState(false);
  const settingLabels = {
    useAttendanceAlert: {
      title: "출석체크 알리미",
      description: "매일매일 출석체크를 잊지 않도록 도와줍니다.",
    },
    useHotkeys: {
      title: "단축키",
      description: "미코 페이지를 빠르게 열람하기 위한 단축키 기능입니다.",
    },
    useLowResolutionSupport: {
      title: "저해상도 지원",
      description: "저해상도 PC에서 페이지가 모두 출력될 수 있도록 도와줍니다.",
    },
  };

  const hotkeys = [
    { key: "nextArticle", label: "다음 글로 이동", default: "w" },
    { key: "prevArticle", label: "이전 글로 이동", default: "s" },
    { key: "voteUpArticle", label: "글 추천", default: "e" },
    { key: "gotoContent", label: "글 영역으로 이동", default: "q" },
    { key: "gotoComments", label: "댓글 영역으로 이동", default: "x" },
  ];

  useEffect(() => {
    chrome.storage.sync.get(["settings"], (data) => {
      if (data && data.settings) {
        setSettings(data.settings);
        return;
      }
      setSettings({
        useAttendanceAlert: true,
        useHotkeys: true,
        useLowResolutionSupport: false,
        hotkeys: {
          ...hotkeys.reduce(function (o, hotkey) {
            o[hotkey.key] = { enabled: true, binded: hotkey.default };
            return o;
          }, {}),
        },
      });
      return;
    });
  }, [hotkeys]);

  const handleChange = useCallback((key, value) => {
    setSettings((current) => {
      const newSettings = { ...current };
      newSettings[key] = !!value;

      chrome.storage.sync.set({
        settings: newSettings,
      });
      setShowSavedMessage(true);
      return newSettings;
    });
  }, []);

  const handleHotkeyToggle = useCallback(
    (key, value) => {
      setSettings((current) => {
        const newSettings = { ...current };
        if (!newSettings?.hotkeys) {
          newSettings.hotkeys = {};
        }
        if (!newSettings?.hotkeys?.[key]) {
          newSettings.hotkeys[key] = {
            enabled: false,
            binded: hotkeys.find((hotkey) => {
              return hotkey.key === key;
            })?.default,
          };
        }
        newSettings.hotkeys[key].enabled = !!value;
        chrome.storage.sync.set({
          settings: newSettings,
        });
        setShowSavedMessage(true);
        return newSettings;
      });
    },
    [hotkeys]
  );

  const handleChangeHotkey = useCallback(
    (key, value) => {
      setSettings((current) => {
        const newSettings = { ...current };
        if (!newSettings?.hotkeys) {
          newSettings.hotkeys = {};
        }
        if (!newSettings?.hotkeys?.[key]) {
          newSettings.hotkeys[key] = {
            enabled: false,
            binded: hotkeys.find((hotkey) => {
              return hotkey.key === key;
            })?.default,
          };
        }
        newSettings.hotkeys[key].binded = value;
        chrome.storage.sync.set({
          settings: newSettings,
        });
        setShowSavedMessage(true);
        return newSettings;
      });
    },
    [hotkeys]
  );
  return (
    <div style={{ padding: 16 }}>
      {/* {JSON.stringify(settings)} */}

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 8,
        }}
      >
        <Text variant="large">Meeco Tools</Text>
        <TooltipHost content="건의 및 문의">
          <Link
            href="https://meeco.kr/index.php?module=pointsend&act=dispPointsend&receiver_srl=25400391"
            target="_blank"
          >
            <IconButton
              iconProps={{ iconName: "Mail" }}
              title="건의 및 문의"
              ariaLabel="건의 및 문의"
            />
          </Link>
        </TooltipHost>
      </div>
      <div style={{ marginBottom: 16 }}>
        <Text variant="medium">
          미코(https://meeco.kr)를 데스크탑에서 더 사용하기 쉽게 도와줍니다.
        </Text>
      </div>
      {showSavedMessage && (
        <div style={{ marginBottom: 16 }}>
          <MessageBar
            messageBarType={MessageBarType.success}
            isMultiline={false}
          >
            저장되었습니다. 모든 설정은 새로고침 후 적용됩니다.
          </MessageBar>
        </div>
      )}
      <Stack
        tokens={stackTokens}
        styles={{ root: { marginTop: 8, marginBottom: 16 } }}
      >
        <Text variant="mediumPlus">사용 설정</Text>
        {Object.keys(settingLabels).map((key) => {
          return (
            <TooltipHost
              content={settingLabels[key].description}
              directionalHint={DirectionalHint.topLeftEdge}
            >
              <Toggle
                onText={settingLabels[key].title}
                offText={settingLabels[key].title}
                checked={settings[key]}
                onChange={(e, v) => {
                  handleChange(key, v);
                }}
              />
              <Text variant="xSmall">{settingLabels[key].description}</Text>
            </TooltipHost>
          );
        })}
      </Stack>
      {settings.useHotkeys && (
        <Stack tokens={stackTokens}>
          <Text variant="mediumPlus">단축키 설정</Text>
          {Array.isArray(hotkeys) &&
            hotkeys.map((hotkey) => {
              return (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Toggle
                    onText={hotkey.label}
                    offText={hotkey.label}
                    checked={settings?.hotkeys?.[hotkey.key]?.enabled}
                    onChange={(e, v) => {
                      handleHotkeyToggle(hotkey.key, v);
                    }}
                  />
                  <TooltipHost content="이곳을 클릭하고 원하는 키를 입력하세요.">
                    <TextField
                      readOnly
                      styles={{ root: { maxWidth: 48 } }}
                      value={settings?.hotkeys?.[hotkey.key]?.binded}
                      onKeyDown={(e) => {
                        const value = e.key;
                        handleChangeHotkey(hotkey.key, value);
                      }}
                    />
                  </TooltipHost>
                </div>
              );
            })}
        </Stack>
      )}
    </div>
  );
};

export default Settings;
