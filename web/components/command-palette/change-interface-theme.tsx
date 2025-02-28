import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Command } from "cmdk";
import { THEME_OPTIONS } from "constants/themes";
import { useTheme } from "next-themes";
import useUser from "hooks/use-user";
import { Settings } from "lucide-react";
import { observer } from "mobx-react-lite";
// mobx store
import { useMobxStore } from "lib/mobx/store-provider";

type Props = {
  setIsPaletteOpen: Dispatch<SetStateAction<boolean>>;
};

export const ChangeInterfaceTheme: React.FC<Props> = observer(({ setIsPaletteOpen }) => {
  const store: any = useMobxStore();

  const [mounted, setMounted] = useState(false);

  const { setTheme } = useTheme();

  const { user } = useUser();

  const updateUserTheme = (newTheme: string) => {
    if (!user) return;
    setTheme(newTheme);
    return store.user
      .updateCurrentUserSettings({ theme: { ...user.theme, theme: newTheme } })
      .then((response: any) => response)
      .catch((error: any) => error);
  };

  // useEffect only runs on the client, so now we can safely show the UI
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <>
      {THEME_OPTIONS.filter((t) => t.value !== "custom").map((theme) => (
        <Command.Item
          key={theme.value}
          onSelect={() => {
            updateUserTheme(theme.value);
            setIsPaletteOpen(false);
          }}
          className="focus:outline-none"
        >
          <div className="flex items-center gap-2 text-custom-text-200">
            <Settings className="h-4 w-4 text-custom-text-200" />
            {theme.label}
          </div>
        </Command.Item>
      ))}
    </>
  );
});
