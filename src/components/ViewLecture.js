import React, { useEffect } from 'react';
import { hostUrl } from '../../config';
import ReactWebMediaPlayer from 'react-web-media-player';
import $ from 'jquery';

let timeout = null;
let dragTime = false;
let dragVolume = false;

const ViewLecture = ({ match }) => {
  useEffect(() => {
    const url = match.params.url;

    const video = $('video');
    if (video) {
      customPlayer(video, url);
    }
  }, []);

  const customPlayer = (video, url) => {
    const container = $('#videoContainer');
    const control = $('#video-controls');

    const loading = $('#loading');
    const caption = $('#caption');
    const progress = $('#progress');
    const time = $('#time');
    const current = $('#current');
    const duration = $('#duration');
    const playpause = $('#playpause');
    const stopvideo = $('#stopvideo');
    const rewind_15s = $('#rewind_15s');
    const forward_15s = $('#forward_15s');
    const mutevolume = $('#mutevolume');
    const volume = $('#volume');
    const fullscreen = $('#fullscreen');

    const playpauseIcon = function (state) {
      const node = playpause.children('i');
      if (state) {
        if (node) {
          node.removeClass('fa-pause-circle-o');
          node.addClass('fa-play-circle-o');
        }
      } else {
        if (node) {
          node.removeClass('fa-play-circle-o');
          node.addClass('fa-pause-circle-o');
        }
      }
    };
    const mutevolumeIcon = function (state) {
      const node = mutevolume.children('i');
      if (state) {
        if (node) {
          node.removeClass('fa-volume-up');
          node.addClass('fa-volume-off');
        }
      } else {
        if (node) {
          node.removeClass('fa-volume-off');
          node.addClass('fa-volume-up');
        }
      }
    };
    const fullscreenIcon = function (state) {
      const node = fullscreen.children('i');
      if (state) {
        if (node) {
          node.removeClass('fa-window-restore');
          node.addClass('fa-expand');
        }
      } else {
        if (node) {
          node.removeClass('fa-expand');
          node.addClass('fa-window-restore');
        }
      }
    };

    video.removeAttr('autoplay');
    video.removeAttr('controls');
    video.bind('contextmenu', function () {
      return false;
    });

    // caption.text('lecture ' + url);

    control.show().css({ opacity: 0 });

    caption.fadeIn(500);

    video.on('loadedmetadata', function () {
      caption.animate({ opacity: 0 }, 250);
      current.text(timeFormat(0));
      duration.text(timeFormat(video[0].duration));
      updateVolume(0, 0.8);
      playpauseIcon(false);
      fullscreenIcon(true);
      setTimeout(buffering, 150);

      const animate = function () {
        if (timeout) {
          clearTimeout(timeout);
        }

        control.stop().animate({ opacity: 1 }, 500);
        caption.stop().animate({ opacity: 1 }, 500);

        timeout = setTimeout(function () {
          control.stop().animate({ opacity: 0 }, 500);
          caption.stop().animate({ opacity: 0 }, 500);
        }, 2000);
      };

      container
        .append('<div id="holder"></div>')
        .mouseover(function () {
          animate();
        })
        .mousemove(function () {
          animate();
        })
        .on('click', function () {
          $('#holder').remove();
          playpauseIcon(false);
          $(this).unbind('click');
          video[0].play();
        });
      $('#holder').fadeIn(200);
    });

    const buffering = function () {
      const currentBuffer = video[0].buffered.end(0);
      const maxduration = video[0].duration;
      const percent = (100 * currentBuffer) / maxduration;
      $('.bufferBar').css('width', percent + '%');

      if (currentBuffer < maxduration) {
        setTimeout(buffering, 500);
      }
    };

    video.on('timeupdate', function () {
      const currentPos = video[0].currentTime;
      const maxduration = video[0].duration;
      const percent = (100 * currentPos) / maxduration;
      $('.timeBar').css('width', percent + '%');
      current.text(timeFormat(currentPos));
    });

    const playVideo = function () {
      if (video[0].paused || video[0].ended) {
        playpauseIcon(false);
        video[0].play();
      } else {
        playpauseIcon(true);
        video[0].pause();
      }
    };

    video.on('click', function () {
      playVideo();
    });

    playpause.on('click', function () {
      playVideo();
    });

    stopvideo.on('click', function () {
      const maxduration = video[0].duration;
      const percentage = 99.99;
      $('.timeBar').css('width', percentage + '%');
      video[0].currentTime = (maxduration * percentage) / 100;
      video[0].pause();
      playpauseIcon(true);
    });

    rewind_15s.on('click', function () {
      const t = video[0].currentTime;
      const f = timeFormat(t);
      console.log(t + ':' + f);

      updateTime(video[0].currentTime - 15);
    });

    forward_15s.on('click', function () {
      const t = video[0].currentTime;
      const f = timeFormat(t);
      console.log(t + ':' + f);

      updateTime(video[0].currentTime + 15);
    });

    $('#0_5').on('click', function () {
      speedRate(0.5);
    });
    $('#1_0').on('click', function () {
      speedRate(1.0);
    });
    $('#2_0').on('click', function () {
      speedRate(2.0);
    });

    const speedRate = function (speed) {
      video[0].playbackRate = speed;
      video[0].play();
    };

    mutevolume.click(function () {
      video[0].muted = !video[0].muted;
      mutevolumeIcon(video[0].muted);
      if (video[0].muted) {
        $('.volumeBar').css('width', 0);
      } else {
        $('.volumeBar').css('width', video[0].volume * 100 + '%');
      }
    });

    fullscreen.on('click', function () {
      handleFullscreen();
    });

    progress.on('mousedown', function (e) {
      dragTime = true;
      updatebar(e.pageX);
    });
    $(document).on('mouseup', function (e) {
      if (dragTime) {
        dragTime = false;
        updatebar(e.pageX);
      }
    });
    $(document).on('mousemove', function (e) {
      if (dragTime) {
        updatebar(e.pageX);
      }
    });
    const updatebar = function (x) {
      const maxduration = video[0].duration;
      const position = x - progress.offset().left;
      let percentage = (100 * position) / progress.width();
      if (percentage > 100) {
        percentage = 100;
      }
      if (percentage < 0) {
        percentage = 0;
      }
      $('.timeBar').css('width', percentage + '%');
      video[0].currentTime = (maxduration * percentage) / 100;
    };

    const updateTime = function (x) {
      video[0].pause();
      const maxduration = video[0].duration;
      const percentage = (x * 100) / maxduration;
      $('.timeBar').css('width', percentage + '%');
      video[0].currentTime = (maxduration * percentage) / 100;
    };

    volume.on('mousedown', function (e) {
      dragVolume = true;
      video[0].muted = false;
      updateVolume(e.pageX);
    });
    $(document).on('mouseup', function (e) {
      if (dragVolume) {
        dragVolume = false;
        updateVolume(e.pageX);
      }
    });
    $(document).on('mousemove', function (e) {
      if (dragVolume) {
        updateVolume(e.pageX);
      }
    });
    const updateVolume = function (x, vol) {
      let percentage = 0;
      if (vol) {
        percentage = vol * 100;
      } else {
        const position = x - volume.offset().left;
        percentage = (100 * position) / volume.width();
      }

      if (percentage > 100) {
        percentage = 100;
      }
      if (percentage < 0) {
        percentage = 0;
      }

      $('.volumeBar').css('width', percentage + '%');
      video[0].volume = percentage / 100;

      if (video[0].volume <= 0) {
        mutevolumeIcon(true);
      } else {
        mutevolumeIcon(false);
      }
    };

    const timeFormat = function (seconds) {
      const m =
        Math.floor(seconds / 60) < 10
          ? '0' + Math.floor(seconds / 60)
          : Math.floor(seconds / 60);
      const s =
        Math.floor(seconds - m * 60) < 10
          ? '0' + Math.floor(seconds - m * 60)
          : Math.floor(seconds - m * 60);
      return m + ':' + s;
    };

    const fullScreenEnabled = !!(
      document.fullscreenEnabled ||
      document.mozFullScreenEnabled ||
      document.msFullscreenEnabled ||
      document.webkitSupportsFullscreen ||
      document.webkitFullscreenEnabled ||
      video.webkitRequestFullScreen
    );
    if (!fullScreenEnabled) {
      fullscreen.style.display = 'none';
    }

    const isFullScreen = function () {
      return !!(
        document.fullScreen ||
        document.webkitIsFullScreen ||
        document.mozFullScreen ||
        document.msFullscreenElement ||
        document.fullscreenElement
      );
    };

    const handleFullscreen = function () {
      if (isFullScreen()) {
        if (document.exitFullscreen) document.exitFullscreen();
        else if (document.mozCancelFullScreen) document.mozCancelFullScreen();
        else if (document.webkitCancelFullScreen)
          document.webkitCancelFullScreen();
        else if (document.msExitFullscreen) document.msExitFullscreen();
      } else {
        if (video[0].requestFullscreen) video[0].requestFullscreen();
        else if (video[0].mozRequestFullScreen) video[0].mozRequestFullScreen();
        else if (video[0].webkitRequestFullScreen)
          video[0].webkitRequestFullScreen();
        else if (video[0].msRequestFullscreen) video[0].msRequestFullscreen();
      }

      fullscreenIcon(isFullScreen());
    };
  };

  const renderControl = () => {
    return (
      <div>
        <div id='loading' />
        <div id='caption' className='caption' />
        <div id='video-controls' className='control text-white'>
          <div className='upControl'>
            <div id='progress' className='progress'>
              <span className='bufferBar' />
              <span className='timeBar' />
            </div>
            <div id='time' className='time'>
              <span id='current' />
              <span> / </span>
              <span id='duration' />
            </div>
          </div>
          <div className='downControl'>
            <span id='playpause' className='icon'>
              <i className='fa' aria-hidden='true' />
            </span>
            <span id='stopvideo' className='icon'>
              <i className='fa fa-stop-circle-o' aria-hidden='true' />
            </span>
            <span id='rewind_15s' className='icon'>
              <i className='fa fa-undo' aria-hidden='true' />
            </span>
            <span id='forward_15s' className='icon'>
              <i className='fa fa-repeat' aria-hidden='true' />
            </span>
            <span id='fullscreen' className='icon fullscreen'>
              <i className='fa' aria-hidden='true' />
            </span>
            <a href='#' id='0_5' className='speedRate'>
              x0.5
            </a>
            <a href='#' id='1_0' className='speedRate'>
              x1.0
            </a>
            <a href='#' id='2_0' className='speedRate'>
              x2.0
            </a>
            <span id='mutevolume' className='icon'>
              <i className='fa' aria-hidden='true' />
            </span>
            <span id='volume' className='volume'>
              <a className='volumeBar' />
            </span>
          </div>
        </div>
      </div>
    );
  };

  const renderVideo = () => {
    const { url } = match.params;
    if (!url || url.length < 0) return <div>&nbsp;</div>;

    return (
      <div>
        <div id='videoContainer' className='videoContainer'>

          <ReactWebMediaPlayer
            title="Power of Courage"
            video={`${hostUrl}/video/lecture-${url}.mp4`}
            thumbnail='link-to-my-thumbnail.jpg'
            style={{ marginLeft: 'auto', width: '100px', height: '100px', marginRight: 'auto' }}
            fileConfig={{ attributes: { preload: true } }}
          />
          {renderControl()}
        </div>
      </div>
    );
  };

  const { url } = match.params;
  if (!url || url.length < 0) return <div>&nbsp;</div>;

  return <div>{renderVideo()}</div>;
};

export default ViewLecture;
