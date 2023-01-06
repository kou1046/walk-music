import Image from "next/image"
import Box from "@mui/material/Box"
import Typography from "@mui/material/Typography"
import PlayCircleIcon from '@mui/icons-material/PlayCircle';
import IconButton from "@mui/material/IconButton";
import { TrackWithFeature } from "../../types/spotifyapi"
import axios from "axios";

type PropsType = {
    track: TrackWithFeature
    deviceID?: string
    player?: Spotify.Player
}

const TrackCard = ({ track, deviceID, player }: PropsType) => {
    return <>
        <Box sx={{display: "flex", alignItems: "center", borderBottom: "solid whitesmoke 1px", bgcolor: "whitesmoke"}}>
          <Image src={track.albumImages[1].url} alt={track.name} style={{width: "auto", height: "auto"}} width={80} height={80} ></Image>
          <Box sx={{ml: 2, whiteSpace: "nowrap", textOverflow: "ellipsis", overflow: "hidden"}}>
            <Typography sx={{fontWeight: "bold", mb: 1, }}>{track.name}</Typography>
            <Typography variant="body2" color={"textSecondary"}>{track.artists[0].name}</Typography>
            <Box sx={{display: "flex"}}>
              <Typography color={"textSecondary"} variant="body2">BPM: {track.tempo}</Typography>              
            </Box>
          </Box>
          <Box sx={{ml: "auto", mr: 1}}>
            <IconButton onClick={ () => {
              if (!deviceID) return
              axios.post(`/api/player/play/?deviceID=${ deviceID }`, { uris: [track.uri] });
              player?.resume();
            }}>
              <PlayCircleIcon sx={{width: 30, height: 30}}/>
            </IconButton>
          </Box>
        </Box>
    </>
}

export default TrackCard