document.addEventListener('DOMContentLoaded', function () {
 
  const sliderTrack = document.getElementById('slider-track');
  const sliderRange = document.getElementById('slider-range');
  const sliderBlur = document.getElementById('slider-blur');
  const handle1 = document.getElementById('slider-handle-1');
  const handle2 = document.getElementById('slider-handle-2');
  const yearRangeDisplay = document.getElementById('year-range-display');
  const sliderTicks = document.getElementById('slider-ticks');
  const sliderLabels = document.getElementById('slider-labels');

  const minYear = 1250;
  const maxYear = 2024;
  const breakpointYear = 1800;
  const sliderWidth = sliderTrack.offsetWidth;
  

  let draggingHandle = null;
  
  // Convert year to slider percent
  function yearToPercent(year) {
    if (year <= breakpointYear) {
      return (year - minYear) / (breakpointYear - minYear) * 20; 
    } else {
      return 20 + ((year - breakpointYear) / (maxYear - breakpointYear) * 80); 
    }
  }

  function percentToYear(percent) {
    if (percent <= 20) {
      return minYear + (percent / 20) * (breakpointYear - minYear);
    } else {
      return breakpointYear + ((percent - 20) / 80) * (maxYear - breakpointYear);
    }
  }

  function createTicksAndLabels() {
    sliderTicks.innerHTML = '';
    sliderLabels.innerHTML = '';

    const years = [1250, 1800, 1850, 1900, 1950, 2000];
    years.forEach(year => {
      const percent = yearToPercent(year);
      // Ticks
      const tick = document.createElement('div');
      tick.className = 'slider-tick';
      tick.style.left = `${percent}%`;
      sliderTicks.appendChild(tick);

      // Labels
      const label = document.createElement('div');
      label.className = 'slider-label';
      label.style.left = `${percent}%`;
      label.textContent = year;
      sliderLabels.appendChild(label);
    });
  }

  // Slider range and blur
  function updateSlider() {
    const leftPercent = (parseFloat(handle1.style.left) || 0) / sliderWidth * 100;
    const rightPercent = (parseFloat(handle2.style.left) || sliderWidth) / sliderWidth * 100;

    sliderRange.style.left = `${leftPercent}%`;
    sliderRange.style.width = `${rightPercent - leftPercent}%`;

    sliderBlur.style.background = `
      linear-gradient(
        to right,
        #8f8f8f ${leftPercent}%,
        rgba(0, 0, 0, 0) ${leftPercent}%,
        rgba(0, 0, 0, 0) ${rightPercent}%,
        #8f8f8f ${rightPercent}%
      )`;

    const startYear = Math.round(percentToYear(leftPercent));
    const endYear = Math.round(percentToYear(rightPercent));

    yearRangeDisplay.textContent = `${startYear} - ${endYear}`;

    if (window.updateMap) {
      window.updateMap(startYear, endYear);
    }
  }

  // Mouse move event
  function onMouseMove(event) {
    if (draggingHandle) {
      const sliderRect = sliderTrack.getBoundingClientRect();
      const offsetX = event.clientX - sliderRect.left;
      const min = 0;
      const max = sliderWidth;
      let newLeft = Math.max(min, Math.min(max, offsetX));

      if (draggingHandle === handle2) {
        newLeft = Math.max(parseFloat(handle1.style.left) || 0, newLeft);
      } else {
        newLeft = Math.min(parseFloat(handle2.style.left) || max, newLeft);
      }

      draggingHandle.style.left = `${newLeft}px`;
      updateSlider();
    }
  }

  function onMouseDown(event) {
    draggingHandle = event.target;
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', () => {
      draggingHandle = null;
      document.removeEventListener('mousemove', onMouseMove);
    });
  }

  handle1.addEventListener('mousedown', onMouseDown);
  handle2.addEventListener('mousedown', onMouseDown);

  handle1.style.left = '0px';
  handle2.style.left = `${sliderWidth}px`;
  createTicksAndLabels();
  updateSlider();
});
