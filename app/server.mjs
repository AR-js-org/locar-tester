import express from 'express';
import fs from 'fs/promises';
import ViteExpress from 'vite-express';
import * as fsnp from 'fs';
import dotenv from 'dotenv';
dotenv.config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({extended: false}));

let session = 0;

app.post('/gps/start', async(req, res) => {
    session++;
    const fp = await openLogFile();
    fp.write(`\n//////////\n\nStarted GPS session ${session} at ${new Date()}:\nmin dist ${req.body.gpsMinDistance}\nmin acc ${req.body.gpsMinAccuracy}\n\n`);
    await fp.close();
    res.json({session});
});

app.post('/object/new', async (req, res) => {
    const fp = await openLogFile();
    fp.write(`New object: session ${req.body.session}\nposition ${req.body.position.x},${req.body.position.z}\nProperties: ${JSON.stringify(req.body.properties)}\n\n`);
    await fp.close();
    res.json({success: 1});
});

app.post('/gps/new', async(req, res) => {
    const fp = await openLogFile();
    fp.write(`New GPS pos: session ${req.body.session}\ngpsCount ${req.body.gpsCount}\nlatlon ${req.body.lat},${req.body.lon}\naccuracy ${req.body.acc}\n\n`);
    await fp.close();
    res.json({success: 1});
});

app.post('/worldorigin/new', async(req, res) => {
    const fp = await openLogFile();
    fp.write(`New world origin: session ${req.body.session}\ngpsCount ${req.body.gpsCount}\nlatlon ${req.body.lat},${req.body.lon}\ninitialPosition ${req.body.initialPosition[0]} ${req.body.initialPosition[1]}\n\n`);
    await fp.close();
    res.json({success: 1});
});

app.post('/gps/accepted', async(req, res) => {
    const fp = await openLogFile();
    fp.write(`Accepted GPS pos: session ${req.body.session}\ngpsCount ${req.body.gpsCount}\nworld pos ${req.body.cameraX},${req.body.cameraZ}\ndist moved ${req.body.distMoved}\n\n`);
    await fp.close();
    res.json({success: 1});
});

app.post('/acceptPrivacy', async(req, res) => {
    if(req.body.accepted === "yes") {
        const strm = fsnp.createReadStream(`${process.env.PRIVATEDIR}/gps.html`);
        strm.on("error", e => {
            if(e.code == 'ENOENT') {
                res.send("Internal error - App file not on server.");
            } else {
                res.send("Unknown internal error.");
            }
                
        });
        strm.pipe(res);        
    } else {
        res.send("Please accept the privacy notice in order to access the app.");
    }
});

async function openLogFile() {
    return await fs.open(`${process.env.LOGDIR}/locar-tester.log`, "a");
}

const PORT = 3003;
ViteExpress.listen(app, PORT, () => {
    console.log(`App listening on port ${PORT}.`);
});
