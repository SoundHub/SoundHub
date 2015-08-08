import { PlayButton, Progress, Icons } from 'react-soundplayer/components';
import { SoundPlayerContainer } from 'react-soundplayer/addons';
import React from 'react';

const clientId = '01e3642c7ca1b0481d6555e058b7a89e';
const resolveUrl = 'https://soundcloud.com/stepan-i-meduza-official/dolgo-obyasnyat';

class CustomPlayer extends React.Component {
    play() {
        let { soundCloudAudio, playing } = this.props;
        if (playing) {
            soundCloudAudio.pause();
        } else {
            soundCloudAudio.play();
        }
    }
    render() {
        let { track, playing } = this.props;

        if (!track) {
            return <div>Loading...</div>;
        }

        return (
            <div>
                <h2>{track.title}</h2>
                <h3>{track.user.username}</h3>
                <button onClick={this.play.bind(this)}>
                    {playing ? 'Pause' : 'Play'}
                </button>
            </div>
        );
    }
}

class MusicPlayer extends React.Component {
    render() {
        return (
            <SoundPlayerContainer resolveUrl={resolveUrl} clientId={clientId}>
                <CustomPlayer />
            </SoundPlayerContainer>
        );
    }
}

export default MusicPlayer;