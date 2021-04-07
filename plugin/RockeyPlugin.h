#pragma once
#pragma comment(lib, "pluginsdk.lib")
#pragma comment(lib, "bakkesmod.lib")
#include <Windows.h>

#include <cmath>
#include <numbers>

#include "bakkesmod\plugin\bakkesmodplugin.h"

class RockeyPlugin : public BakkesMod::Plugin::BakkesModPlugin {
 private:
  HWND hwnd;
  bool activated;
  void onReplayStarted();
  void onCameraMove(std::vector<std::string> params);
  void onCameraRotate(std::vector<std::string> params);
  void onRoll(std::vector<std::string> params);
  void onSendKey(std::vector<std::string> params);
  void onActivate();
  void onDeactivate();

 public:
  virtual void onLoad();
  virtual void onUnload();
};
