import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
// import Slide from '@mui/material/Slide';
// import Fade from '@mui/material/Fade';
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography';
import { Temporal } from 'temporal-polyfill'
import Image from './livein19202.png';
import sample from './backiplay.mp4';
const iplayerPink = '#f54996';

const urls = {
  test: 'https://jfayiszondlcqngo5vavioz6bq0ibxen.lambda-url.eu-west-1.on.aws/',
  live: 'https://ypdjc6zbc5cnvth24lk3mm45sm0qtgps.lambda-url.eu-west-1.on.aws'
};

function titlefor(o, rel) {
  return o.title_hierarchy?.titles?.find((t) => t.inherited_from?.link?.rel === `pips-meta:${rel}`)?.title?.$;
}

function gettitles(item) {
  const b = titlefor(item, 'brand');
  const s = titlefor(item, 'series');
  const e = item.title_hierarchy?.titles?.find((t) => !t.inherited_from)?.title?.$;
  const t = b ? `${b}` : '';
  if (s) {
    return {
      episodeTitle: `${e}`,
      brandTitle: `${t}`,
      seriesTitle: `${s}`,
    };
  }
  return {
    episodeTitle: `${e}`,
    brandTitle: `${t}`,
    seriesTitle: '',
  };
}

function chooseNexts(next, minDuration) {
  const ok = (next || []).filter((e) => {
    if (e?.duration && e?.title) {
      return Temporal.Duration.compare(minDuration, Temporal.Duration.from(e.duration)) < 0;
    }
    return false;
  });
  if (ok.length > 0) {
    return ok;
  }
  return { title: '' };
}



function UpComing({ next, previewMinutes, styling }) {

  // let r;
  let eventTitle = 'COMING UP';
  let upcomingitems = [];


  // let eventTime;
  console.log(`Do we have a next? ${next ? JSON.stringify(next, null, 2) : 'undefined - no'}`);
  if (next.length > 0) {
    let itemsToAdd = 3;
    let addedCount = 0;
    let canAdd = true;
    upcomingitems.length = 0;
    while (canAdd) {
      upcomingitems.push(gettitles(next[addedCount]));
      addedCount += 1;
      canAdd = upcomingitems.length < itemsToAdd && upcomingitems.length < next.length;
    }
  } else {
    upcomingitems.push({
      episodeTitle: '',
      brandTitle: `Nothing for the forseeable...`,
      seriesTitle: '',
    });
  }
  return (
    <Box sx={{
      width: 'auto', height: '720px',
      display: 'grid', gridTemplateRows: '1fr 1fr 1fr', paddingLeft: '5%', paddingbottom: '5%'
    }}>
      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          alignContent: 'flex-end',
        }}
      >
        <Typography
          fontSize={'1.7rem'}>
          <span
            style={{
              fontFamily: 'BBCReithSans_W_ExBd',
              color: iplayerPink
            }}>
            {eventTitle}
          </span>
        </Typography>
      </Box>
      <Box>
        {upcomingitems.map((item) => {
          return (<>
            <Box>
              <Typography
                fontFamily={'BBCReithSans_W_Bd'}
                fontSize={'2.6667rem'}>{item.brandTitle}</Typography>
            </Box>
            <Box
              sx={{
                display: 'flex',
                flexWrap: 'wrap',
                alignContent: 'flex-start',
              }}
            >
              <Typography
                fontFamily={'BBCReithSans_W_Md'}
                fontSize={'2.2rem'}>{item.seriesTitle ? `${item.seriesTitle}: ${item.episodeTitle}` : item.episodeTitle}</Typography>
            </Box>
          </>
          )
        })}
      </Box>
      <Box></Box>
    </Box>
  );
}

// function convertISOTimeToMilliSeconds(inISOTime) {
//   const duration = Temporal.Duration.from(inISOTime);
//   return (duration.hours * 60 * 60 * 1000) + (duration.minutes * 60 * 1000) + (duration.seconds * 1000) + duration.milliseconds;
// }

function Middle({ params }) {

  const minDuration = Temporal.Duration.from(params.minDuration || 'PT2M');
  const previewMinutes = params.next ? parseInt(params.next) : 2;

  const env = params.env || 'live';
  const sid = params.sid || 'History_Channel';
  const region = params.region || 'eu-west-2';
  const styling = params.styling || 'grownup';

  const [next, setNext] = useState([]);
  const containerRef = React.useRef(null);

  // const FALSE = false;

  useEffect(() => {
    if (next) {
      const nexts = JSON.stringify(next, 2000, null);
      console.log(`We have some nexts ${nexts}`);

    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [next]);

  // On page load useEffect
  useEffect(() => {
    const tm = setTimeout(() => {
      (async () => {
        const r = await fetch(`${urls[env]}/${sid}/${region}`);
        if (r.ok) {
          const data = await r.json()
          setNext(chooseNexts(data.next, minDuration));
        }
      })();
    }, 1);
    return () => clearTimeout(tm);
  });

  console.log(`styling log ${styling}`);
  return (
    <Box sx={{ overflow: 'hidden' }} ref={containerRef}>
      <Box
        sx={styling === 'grownup' ?
          {
            height: '720px', width: 'auto', color: 'white',
            // background: 'linear-gradient(to right, rgba(15, 15, 15, .8), rgba(245, 73, 151, .8))',
            display: 'grid', gridTemplateColumns: '1fr', marginbottom: '100px'
          }
          : {
            height: '720px', width: 'auto', color: 'black',
            // background: 'linear-gradient(to right, rgba(255, 255, 255, .9), rgba(255, 255, 255, .9))',
            display: 'grid', gridTemplateColumns: '1fr', marginbottom: '100px'
          }}
      >
        <video className='videoTag' autoPlay loop width='1280'
          height='720' muted>
          <source src={sample} type='video/mp4' />
        </video>
        <Box display='flex' alignItems='center'>
          <UpComing next={next} previewMinutes={previewMinutes} styling={styling} />
        </Box>
      </Box>
    </Box>
  );
}

function TopLeft({ show }) {
  if (show) {
    return '';//<img src={logo} alt='CBeebies' />;
  }
  return '';
}

function TopRight({ show }) {
  if (show) {
    return <img alt='bounce' src='https://upload.wikimedia.org/wikipedia/commons/1/14/Animated_PNG_example_bouncing_beach_ball.png' />;
  }
  return '';
}
export default function App(params) {
  const demo = false;
  return (
    <Paper sx={
      demo === true ?
        { backgroundImage: `url(${Image})`, backgroundRepeat: 'round' }
        : { backgroundColor: 'transparent' }}>
      <Box sx={{
        width: 'auto', height: '100vh',
        display: 'grid', gridTemplateRows: '0px 720px 0px'
      }}>
        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr' }}>
          <Box><TopLeft show={params.tl} /></Box>
          <Box></Box>
          <Box sx={{ display: 'block', marginLeft: 'auto' }}><TopRight show={params.tr} /></Box>
        </Box>
        <Middle params={params} />
        <Box></Box>
      </Box>
    </Paper>
  );
}