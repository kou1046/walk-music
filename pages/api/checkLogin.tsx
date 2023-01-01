import axios from "axios";
import { NextApiHandler, NextApiRequest, NextApiResponse } from "next";
import { parseCookies, setCookie,  } from "nookies";
import { SpotifyAuthApiResponse } from "./auth";
import { SpotifyMeAPIResponse } from "../../lib/types/spotifyapi";
import { spotifyAPI } from "../../lib/utils";

export type ResponseType = {
    accessToken?: string,
    me?: SpotifyMeAPIResponse
    message?: string
}

const checkLogin: NextApiHandler<ResponseType> = async (req: NextApiRequest, res: NextApiResponse) => {
    const { user } = parseCookies(res);

    if (user) {
        const userObj = JSON.parse(user) as SpotifyAuthApiResponse;
        const accessToken = userObj.access_token;
        const refreshToken = userObj.refresh_token;
        let api = new spotifyAPI(accessToken);
        let me: SpotifyMeAPIResponse | undefined = undefined;

        try {
            const meRes = await api.fetcher.get<SpotifyMeAPIResponse>("/me");
            me = meRes.data;
        } 
        catch { // token期限切れ
            if (refreshToken) { 
                const response = await axios.post<SpotifyAuthApiResponse>(
                    "https://accounts.spotify.com/api/token", 
                    {
                        "refresh_token": refreshToken, 
                        "grant_type": "refresh_token"
                    }, 
                    {
                        headers: {
                            "Content-Type": "application/x-www-form-urlencoded", 
                            "Authorization": `Basic ${Buffer.from(`${process.env.CLIENT_ID}:${process.env.CLIENT_SECRET}`, 'utf-8')}`
                        }
                    }
                )

                api = new spotifyAPI(response.data.access_token);
                const meRes = await api.fetcher.get<SpotifyMeAPIResponse>("/me");
                me = meRes.data;
                setCookie({ res }, "user", JSON.stringify(response.data));
                res.status(200).json({ accessToken: response.data.access_token, me });
            }
            else {
                res.status(401); 
                res.json({message: "unauthorized"});
            };

        }
        res.status(200).json({ accessToken, me });
    } else {
        res.status(200).json({ message: "Not login"});
    } 
}

export default checkLogin