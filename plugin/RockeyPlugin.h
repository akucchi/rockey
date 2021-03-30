#pragma once
#pragma comment(lib, "pluginsdk.lib")
#pragma comment(lib, "bakkesmod.lib")
#include <cmath>
#include <numbers>

#include "bakkesmod\plugin\bakkesmodplugin.h"

class RockeyPlugin : public BakkesMod::Plugin::BakkesModPlugin {
 private:
  void onReplayStarted();
  void onCameraMove(std::vector<std::string> params);
  void onCameraRotate(std::vector<std::string> params);
  void onRoll(std::vector<std::string> params);

 public:
  virtual void onLoad();
  virtual void onUnload();
};
