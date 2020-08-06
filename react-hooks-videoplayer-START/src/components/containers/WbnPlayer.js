import React, { useState, useEffect } from "react";
import { ThemeProvider } from "styled-components";
import Video from "../Video";
import Playlist from "../containers/Playlist";
import StyledWbnPlayer from "../styles/StyledWbnPlayer";

const theme = {
  bgColor: "#353535",
  bgColorItem: "#414141",
  bgColorItemActive: "#405c63",
  bgColorPlayed: "#526d4e",
  border: "none",
  borderPlayed: "none",
  color: "#fff",
};

const themeLight = {
  bgColor: "#fff",
  bgColorItem: "#fff",
  bgColorItemActive: "#80a7b1",
  bgColorPlayed: "#7d9979",
  border: "1px solid #353535",
  borderPlayed: "none",
  color: "#353535",
};

const WbnPlayer = ({ match, location, history }) => {
  const videos = JSON.parse(document.getElementById("videos").value);
  const [state, setState] = useState({
    videos: videos.playlist,
    activeVideo: videos.playlist[0],
    nightMode: true,
    playlistId: videos.playlistId,
    autoplay: false,
  });

  useEffect(() => {
    const videoId = match.params.activeVideo;
    if (videoId !== undefined) {
      const newActiveVideo = state.videos.findIndex(
        (video) => video.id === videoId
      );
      if (newActiveVideo !== -1)
        return setState((prev) => ({
          ...prev,
          activeVideo: prev.videos[newActiveVideo],
          autoplay: location.autoplay,
        }));
    }
    return history.push({
      pathname: `/${state.activeVideo.id}`,
      autoplay: false,
    });
  }, [
    history,
    location.autoplay,
    match.params.activeVideo,
    state.activeVideo.id,
    state.videos,
  ]);

  const nightModeCallback = () => {};
  const endCallback = () => {};
  const progressCallback = () => {};

  return (
    <ThemeProvider theme={state.nightMode ? theme : themeLight}>
      {state.videos !== null && (
        <StyledWbnPlayer>
          <Video
            active={state.activeVideo}
            autoplay={state.autoplay}
            endCallback={endCallback}
            progressCallback={progressCallback}
          />
          <Playlist
            videos={state.videos}
            active={state.activeVideo}
            nightModeCallback={nightModeCallback}
            nightMode={state.nightMode}
          />
        </StyledWbnPlayer>
      )}
    </ThemeProvider>
  );
};

export default WbnPlayer;
