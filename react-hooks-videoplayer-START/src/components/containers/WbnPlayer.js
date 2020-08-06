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
  const savedState = JSON.parse(localStorage.getItem(`${videos.playlistId}`));

  const [state, setState] = useState({
    videos: savedState ? savedState.videos : videos.playlist,
    activeVideo: savedState ? savedState.activeVideo : videos.playlist[0],
    nightMode: savedState ? savedState.nightMode : true,
    playlistId: savedState ? savedState.playlistId : videos.playlistId,
    autoplay: false,
  });

  useEffect(() => {
    localStorage.setItem(`${state.playlistId}`, JSON.stringify({ ...state }));
  }, [state]);

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

  const nightModeCallback = () => {
    setState({ ...state, nightMode: !state.nightMode });
  };
  const endCallback = () => {
    const videoId = match.params.activeVideo;
    const currentVideoIndex = state.videos.findIndex(
      (video) => video.id === videoId
    );
    const nextVideo =
      currentVideoIndex === state.videos.length - 1 ? 0 : currentVideoIndex + 1;

    history.push({ pathname: `${state.videos[nextVideo]}`, autoplay: false });
  };

  const progressCallback = (e) => {
    if (e.playedSeconds > 10 && e.playedSeconds < 11) {
      console.log(e);
      setState({
        ...state,
        videos: state.videos.map((video) => {
          return video.id === state.activeVideo.id
            ? { ...video, played: true }
            : video;
        }),
      });
    }
  };

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
