import { GetStaticProps } from 'next';
import { Box } from '@mui/system';
import Grid from "@mui/material/Grid";
import Typography from '@mui/material/Typography';
import LoginButton from '../lib/components/auth/LoginButton';
               
export const getStaticProps: GetStaticProps<pageProps> = async () => {
  return { props : {
    clientID: process.env.CLIENT_ID as string, 
    clientSecret: process.env.CLIENT_SECRET as string,
    redirectUri: process.env.REDIRECT_URI as string
  }}
}

type pageProps = {
  clientID: string,
  clientSecret: string, 
  redirectUri: string
}

export default function Home(pageprops: pageProps) {

  return (
    <Grid container direction={"column"} alignItems="center" spacing={10}>
      <Grid item>
        <Box sx={{textAlign: "center", mt: 10}}>
          <Typography variant={"h4"} sx={{fontWeight: "bold"}}>Find your songs by rhythmusic.</Typography>
          <Typography variant={"h5"} sx={{fontWeight: "bold", mt: 3, color: "#1db954"}}>with Spotify API</Typography>
        </Box>
      </Grid>
      <Grid item>
        <Box sx={{display: "flex", flexDirection: "column"}}>
          <LoginButton { ...pageprops }></LoginButton>
        </Box>
      </Grid>
    </Grid>
  )
}