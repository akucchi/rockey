#include "RockeyPlugin.h"

BAKKESMOD_PLUGIN(RockeyPlugin, "Rockey plugin", "0.1", PLUGINTYPE_REPLAY)

void RockeyPlugin::onLoad() {
  gameWrapper->HookEvent(
      "Function TAGame.GameInfo_Replay_TA.EventReplayStarted",
      std::bind(&RockeyPlugin::onReplayStarted, this));

  cvarManager->registerNotifier(
      "rockey_cam_rotate",
      std::bind(&RockeyPlugin::onCameraRotate, this, std::placeholders::_1),
      "Camera rotate", PERMISSION_REPLAY);

  cvarManager->registerNotifier(
      "rockey_cam_move",
      std::bind(&RockeyPlugin::onCameraMove, this, std::placeholders::_1),
      "Camera move", PERMISSION_REPLAY);

  cvarManager->registerNotifier(
      "rockey_roll",
      std::bind(&RockeyPlugin::onRoll, this, std::placeholders::_1),
      "Camera roll", PERMISSION_REPLAY);
}

void RockeyPlugin::onReplayStarted() {
  gameWrapper->SetTimeout(
      [](GameWrapper *gw) { gw->GetCamera().SetCameraState("Fly"); }, 1);
}

void RockeyPlugin::onCameraRotate(std::vector<std::string> params) {
  int x, y;
  try {
    x = std::stoi(params.at(1));
    y = std::stoi(params.at(2));
  } catch (std::exception e) {
    cvarManager->log(e.what());
    return;
  }

  auto camera = gameWrapper->GetCamera();
  auto rotation = camera.GetRotation();
  rotation.Yaw += x * 32;
  rotation.Pitch -= y * 32;
  camera.SetRotation(rotation);
}

void RockeyPlugin::onCameraMove(std::vector<std::string> params) {
  int x, y;
  try {
    x = std::stoi(params.at(1)) * 32;
    y = std::stoi(params.at(2)) * 16384;
  } catch (std::exception e) {
    cvarManager->log(e.what());
    return;
  }

  auto camera = gameWrapper->GetCamera();
  auto location = camera.GetLocation();
  auto rotation = camera.GetRotation();
  if (y == 0) {
    location.Y += std::sin((rotation.Yaw) / 65536.0 * 6.28318530718) * x;
    location.X += std::cos((rotation.Yaw) / 65536.0 * 6.28318530718) * x;
    location.Z += std::sin(rotation.Pitch / 65536.0 * 6.28318530718) * x;
  } else {
    location.Y += std::sin((rotation.Yaw - y) / 65536.0 * 6.28318530718) * 32;
    location.X += std::cos((rotation.Yaw - y) / 65536.0 * 6.28318530718) * 32;
  }
  camera.SetLocation(location);
}

void RockeyPlugin::onRoll(std::vector<std::string> params) {
  int value;
  try {
    value = std::stoi(params.at(1));
  } catch (std::exception e) {
    cvarManager->log(e.what());
    return;
  }

  auto camera = gameWrapper->GetCamera();
  auto rotation = camera.GetRotation();
  rotation.Roll += value * 32;
  camera.SetRotation(rotation);
}

void RockeyPlugin::onUnload() {}
