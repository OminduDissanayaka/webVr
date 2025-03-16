// Main script for Digital Vesak Thorana - Nalapana Jataka
document.addEventListener('DOMContentLoaded', function() {
  // Elements
  const loadingScreen = document.getElementById('loading-screen');
  const loadingProgress = document.getElementById('loading-progress');
  const loadingText = document.getElementById('loading-text');
  const thorana = document.getElementById('thorana');
  const jatakaPanels = document.getElementById('jataka-panels');
  const nightLights = document.getElementById('night-lights');
  const skybox = document.getElementById('skybox');
  const ambientDayLight = document.getElementById('ambient-day-light');
  const ambientNightLight = document.getElementById('ambient-night-light');
  const directionalDayLight = document.getElementById('directional-day-light');
  const directionalNightLight = document.getElementById('directional-night-light');
  const leftDoor = document.getElementById('left-door');
  const rightDoor = document.getElementById('right-door');
  const cursor = document.getElementById('cursor');
  
  // Sound effects
  const kaviBanaDay = new Howl({
    src: [document.getElementById('kavi-bana-day').getAttribute('src')],
    loop: true,
    volume: 0.5,
    html5: true
  });
  
  const kaviBanaNight = new Howl({
    src: [document.getElementById('kavi-bana-night').getAttribute('src')],
    loop: true,
    volume: 0.7,
    html5: true
  });
  
  const clickSound = new Howl({
    src: [document.getElementById('click-sound').getAttribute('src')],
    volume: 0.8,
    html5: true
  });
  
  // Simulation of loading progress
  let progress = 0;
  const loadingInterval = setInterval(() => {
    progress += Math.random() * 10;
    if (progress >= 100) {
      progress = 100;
      clearInterval(loadingInterval);
      
      // Fade out loading screen
      setTimeout(() => {
        loadingScreen.style.opacity = 0;
        loadingScreen.style.transition = 'opacity 1s ease';
        setTimeout(() => {
          loadingScreen.style.display = 'none';
          // Initialize scene after loading
          initScene();
        }, 1000);
      }, 500);
    }
    loadingProgress.style.width = progress + '%';
    loadingText.textContent = `Loading Nalapana Jataka Experience... ${Math.floor(progress)}%`;
  }, 200);
  
  // Initialize scene
  function initScene() {
    updateTimeBasedElements();
    
    // Set up event listeners
    cursor.addEventListener('click', handleClick);
    
    // Set up animation loop for continuous effects
    setInterval(updateTimeBasedElements, 60000); // Check every minute
    
    // Start background music based on time
    if (isNightTime()) {
      kaviBanaNight.play();
    } else {
      kaviBanaDay.play();
    }
  }
  
  // Check if current time is night time (5 PM to 6 AM)
  function isNightTime() {
    const currentHour = new Date().getHours();
    return currentHour >= 17 || currentHour < 6;
  }
  
  // Update elements based on time of day
  function updateTimeBasedElements() {
    const isNight = isNightTime();
    
    // Update skybox
    skybox.setAttribute('material', {
      src: isNight ? '#sky-night' : '#sky-day'
    });
    
    // Update lighting
    ambientDayLight.setAttribute('visible', !isNight);
    ambientNightLight.setAttribute('visible', isNight);
    directionalDayLight.setAttribute('visible', !isNight);
    directionalNightLight.setAttribute('visible', isNight);
    
    // Update thorana doors
    if (isNight) {
      openThoranaWithAnimation();
      nightLights.setAttribute('visible', true);
      jatakaPanels.setAttribute('visible', true);
      
      // Switch music if needed
      if (!kaviBanaNight.playing()) {
        kaviBanaDay.fade(0.5, 0, 1000);
        setTimeout(() => {
          kaviBanaDay.pause();
          kaviBanaNight.play();
        }, 1000);
      }
    } else {
      closeThoranaWithAnimation();
      nightLights.setAttribute('visible', false);
      jatakaPanels.setAttribute('visible', false);
      
      // Switch music if needed
      if (!kaviBanaDay.playing()) {
        kaviBanaNight.fade(0.7, 0, 1000);
        setTimeout(() => {
          kaviBanaNight.pause();
          kaviBanaDay.play();
        }, 1000);
      }
    }
  }
  
  // Open thorana with animation
  function openThoranaWithAnimation() {
    // Animate left door
    leftDoor.setAttribute('animation', {
      property: 'position',
      to: '-4.5 5 0',
      dur: 2000,
      easing: 'easeOutQuad'
    });
    
    // Animate right door
    rightDoor.setAttribute('animation', {
      property: 'position',
      to: '4.5 5 0',
      dur: 2000,
      easing: 'easeOutQuad'
    });
  }
  
  // Close thorana with animation
  function closeThoranaWithAnimation() {
    // Animate left door
    leftDoor.setAttribute('animation', {
      property: 'position',
      to: '-2.5 5 0',
      dur: 2000,
      easing: 'easeOutQuad'
    });
    
    // Animate right door
    rightDoor.setAttribute('animation', {
      property: 'position',
      to: '2.5 5 0',
      dur: 2000,
      easing: 'easeOutQuad'
    });
  }
  
  // Handle click events in the scene
  function handleClick(event) {
    clickSound.play();
    
    // Get the clicked element
    const clickedEl = event.detail.intersectedEl;
    
    // Handle different interactions based on what was clicked
    if (clickedEl.closest('#jataka-panels')) {
      // Show more detailed information or animate the clicked panel
      clickedEl.setAttribute('animation', {
        property: 'scale',
        to: '1.1 1.1 1.1',
        dur: 300,
        easing: 'easeOutQuad'
      });
      
      setTimeout(() => {
        clickedEl.setAttribute('animation', {
          property: 'scale',
          to: '1 1 1',
          dur: 300,
          easing: 'easeOutQuad'
        });
      }, 300);
    } else if (clickedEl.closest('#thorana-structure')) {
      // Toggle thorana state manually when clicked on structure
      if (jatakaPanels.getAttribute('visible') === 'true') {
        // Force close if open at night
        closeThoranaWithAnimation();
        jatakaPanels.setAttribute('visible', false);
        
        setTimeout(() => {
          // But reopen after 5 seconds if it's night time
          if (isNightTime()) {
            openThoranaWithAnimation();
            jatakaPanels.setAttribute('visible', true);
          }
        }, 5000);
      } else if (isNightTime()) {
        // Force open if closed at night
        openThoranaWithAnimation();
        jatakaPanels.setAttribute('visible', true);
      }
    }
  }
  
  // Add window resize handler for responsive design
  window.addEventListener('resize', function() {
    // Adjust camera or other elements if needed
  });

  // Add immersive mode toggle for mobile
  document.addEventListener('keydown', function(event) {
    // 'F' key for fullscreen toggle
    if (event.key === 'f' || event.key === 'F') {
      toggleFullscreen();
    }
  });
  
  function toggleFullscreen() {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(err => {
        console.log(`Error attempting to enable fullscreen: ${err.message}`);
      });
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  }
  
  // Add debug info to console
  console.log("Digital Vesak Thorana - Nalapana Jataka");
  console.log("Created by: Omindu Dissanayake");
  console.log("Java Institute - Full Stack Engineer");
  console.log(`Current time: ${new Date().toLocaleTimeString()}`);
  console.log(`Thorana status: ${isNightTime() ? 'Open (Night Mode)' : 'Closed (Day Mode)'}`);
});

// Add A-Frame component for animated glow effect on lights
AFRAME.registerComponent('glow-effect', {
  schema: {
    intensity: {type: 'number', default: 0.5},
    color: {type: 'color', default: '#FFF'},
    speed: {type: 'number', default: 1}
  },
  
  init: function() {
    this.time = 0;
    this.originalIntensity = this.data.intensity;
  },
  
  tick: function(time, timeDelta) {
    this.time += timeDelta / 1000 * this.data.speed;
    
    // Create pulsing effect
    const pulseValue = Math.sin(this.time) * 0.2 + 0.8;
    
    // Apply to material
    if (this.el.getAttribute('material')) {
      this.el.setAttribute('material', 'emissiveIntensity', this.originalIntensity * pulseValue);
    }
    
    // Apply to light if present
    const light = this.el.querySelector('[light]');
    if (light) {
      light.setAttribute('light', 'intensity', this.originalIntensity * pulseValue);
    }
  }
});

// Add component for spinning animation on certain elements
AFRAME.registerComponent('slow-spin', {
  schema: {
    speed: {type: 'number', default: 0.1}
  },
  
  tick: function(time, timeDelta) {
    // Get current rotation
    const rotation = this.el.getAttribute('rotation');
    
    // Update Y rotation
    rotation.y += this.data.speed * (timeDelta / 16);
    
    // Apply new rotation
    this.el.setAttribute('rotation', rotation);
  }
});

// Add custom shaders for enhanced visual effects
AFRAME.registerShader('gradient-sky', {
  schema: {
    topColor: {type: 'color', default: '#1a3fb0'},
    bottomColor: {type: 'color', default: '#0e175f'},
    speed: {type: 'number', default: 0.001}
  },
  
  vertexShader: `
    varying vec2 vUV;
    
    void main() {
      vUV = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  
  fragmentShader: `
    uniform vec3 topColor;
    uniform vec3 bottomColor;
    uniform float speed;
    uniform float time;
    varying vec2 vUV;
    
    void main() {
      float h = vUV.y + sin(time * speed) * 0.1;
      gl_FragColor = vec4(mix(bottomColor, topColor, h), 1.0);
    }
  `
});































// // Main JavaScript for the Vesak Thorana VR Experience
//     document.addEventListener('DOMContentLoaded', function() {
//       // Elements
//       const scene = document.querySelector('a-scene');
//       const thorana = document.querySelector('#thorana');
//       const leftDoor = document.querySelector('#left-door');
//       const rightDoor = document.querySelector('#right-door');
//       const jatakaPanels = document.querySelector('#jataka-panels');
//       const nightLights = document.querySelector('#night-lights');
//       const skybox = document.querySelector('#skybox');
      
//       const ambientDayLight = document.querySelector('#ambient-day-light');
//       const ambientNightLight = document.querySelector('#ambient-night-light');
//       const directionalDayLight = document.querySelector('#directional-day-light');
//       const directionalNightLight = document.querySelector('#directional-night-light');
      
//       const loadingScreen = document.getElementById('loading-screen');
//       const loadingProgress = document.getElementById('loading-progress');
//       const loadingText = document.getElementById('loading-text');
      
//       // Audio setup
//       let currentAudio = null;
//       let audioContext = null;
      
//       // Time-based configuration
//       const openHour = 17; // 5 PM
//       const closeHour = 6;  // 6 AM
      
//       // Simulate loading
//       let progress = 0;
//       const loadingInterval = setInterval(() => {
//         progress += 5;
//         loadingProgress.style.width = progress + '%';
        
//         if (progress === 25) {
//           loadingText.textContent = 'Loading Jataka scenes...';
//         } else if (progress === 50) {
//           loadingText.textContent = 'Preparing lighting effects...';
//         } else if (progress === 75) {
//           loadingText.textContent = 'Loading audio...';
//         }
        
//         if (progress >= 100) {
//           clearInterval(loadingInterval);
//           setTimeout(() => {
//             loadingScreen.style.display = 'none';
//             initializeExperience();
//           }, 500);
//         }
//       }, 200);
      
//       // Initialize the VR experience
//       function initializeExperience() {
//         updateTimeBasedElements();
//         setupAudio();
        
//         // Update every minute
//         setInterval(updateTimeBasedElements, 60000);
        
//         // Setup interactions
//         setupInteractions();
//       }
      
//       // Update time-based elements
//       function updateTimeBasedElements() {
//         const now = new Date();
//         const hours = now.getHours();
//         const isNightTime = hours >= openHour || hours < closeHour;
        
//         // Update skybox
//         skybox.setAttribute('material', {
//           src: isNightTime ? '#sky-night' : '#sky-day',
//           side: 'back'
//         });
        
//         // Update lighting
//         ambientDayLight.setAttribute('visible', !isNightTime);
//         ambientNightLight.setAttribute('visible', isNightTime);
//         directionalDayLight.setAttribute('visible', !isNightTime);
//         directionalNightLight.setAttribute('visible', isNightTime);
        
//         // Handle thorana opening/closing
//         if (isNightTime) {
//           openThorana();
//         } else {
//           closeThorana();
//         }
//       }
      
//       // Open the thorana
//       function openThorana() {
//         // Animate doors opening
//         leftDoor.setAttribute('animation', {
//           property: 'position',
//           to: '-5 5 0',
//           dur: 3000,
//           easing: 'easeOutQuad'
//         });
        
//         rightDoor.setAttribute('animation', {
//           property: 'position',
//           to: '5 5 0',
//           dur: 3000,
//           easing: 'easeOutQuad'
//         });
        
//         // Show elements
//         setTimeout(() => {
//           jatakaPanels.setAttribute('visible', true);
//           nightLights.setAttribute('visible', true);
          
//           // Start night audio
//           playAudio('night');
//         }, 2000);
//       }
      
//       // Close the thorana
//       function closeThorana() {
//         // Hide elements
//         jatakaPanels.setAttribute('visible', false);
//         nightLights.setAttribute('visible', false);
        
//         // Animate doors closing
//         leftDoor.setAttribute('animation', {
//           property: 'position',
//           to: '-2.5 5 0',
//           dur: 3000,
//           easing: 'easeOutQuad'
//         });
        
//         rightDoor.setAttribute('animation', {
//           property: 'position',
//           to: '2.5 5 0',
//           dur: 3000,
//           easing: 'easeOutQuad'
//         });
        
//         // Start day audio
//         playAudio('day');
//       }
      
//       // Setup audio system
//       function setupAudio() {
//         // Use Howler.js for audio
//         audioContext = new (window.AudioContext || window.webkitAudioContext)();
        
//         // Initialize based on time
//         const now = new Date();
//         const hours = now.getHours();
//         playAudio(hours >= openHour || hours < closeHour ? 'night' : 'day');
//       }
      
//       // Play appropriate audio
//       function playAudio(time) {
//         // Stop current audio if playing
//         if (currentAudio) {
//           currentAudio.stop();
//         }
        
//         // Create new audio
//         currentAudio = new Howl({
//           src: [time === 'night' ? '#kavi-bana-night' : '#kavi-bana-day'],
//           autoplay: true,
//           loop: true,
//           volume: 0.5
//         });
//       }
      
//       // Setup interactions
//       function setupInteractions() {
//         // Cursor interaction sound
//         const cursor = document.querySelector('#cursor');
//         cursor.addEventListener('click', function() {
//           new Howl({
//             src: ['#click-sound'],
//             volume: 0.5
//           }).play();
//         });
        
//         // Make Jataka panels interactive
//         const panels = document.querySelectorAll('#jataka-panels > a-entity');
//         panels.forEach(panel => {
//           panel.addEventListener('mouseenter', function() {
//             this.setAttribute('animation', {
//               property: 'scale',
//               to: '1.1 1.1 1.1',
//               dur: 300,
//               easing: 'easeOutQuad'
//             });
//           });
          
//           panel.addEventListener('mouseleave', function() {
//             this.setAttribute('animation', {
//               property: 'scale',
//               to: '1 1 1',
//               dur: 300,
//               easing: 'easeOutQuad'
//             });
//           });
//         });
//       }
//     });
//     // This code can be added to the previous A-Frame.io WebVR experience
// // to create dynamic lighting patterns for the Thorana

// // Lighting patterns for the Thorana
// // const lightingPatterns = {
// //   // Sequential lighting - lights up sequentially from outside to inside
// //   sequential: function(lightElements, duration = 5000) {
// //     const totalElements = lightElements.length;
// //     const delayPerElement = duration / totalElements;
    
// //     lightElements.forEach((element, index) => {
// //       setTimeout(() => {
// //         element.setAttribute('visible', true);
// //         // Add a small pulse animation
// //         element.setAttribute('animation', {
// //           property: 'scale',
// //           from: '1 1 1',
// //           to: '1.2 1.2 1.2',
// //           dur: 300,
// //           dir: 'alternate',
// //           loop: 1
// //         });
// //       }, index * delayPerElement);
// //     });
// //   },
  
// //   // Radial pattern - lights up from center to outside (or reverse)
// //   radial: function(lightElements, fromCenter = true, duration = 4000) {
// //     // Calculate center position
// //     const centerX = 0;
// //     const centerY = 5;
    
// //     // Sort elements by distance from center
// //     const sortedElements = [...lightElements].sort((a, b) => {
// //       const posA = a.getAttribute('position');
// //       const posB = b.getAttribute('position');
      
// //       const distA = Math.sqrt(Math.pow(posA.x - centerX, 2) + Math.pow(posA.y - centerY, 2));
// //       const distB = Math.sqrt(Math.pow(posB.x - centerX, 2) + Math.pow(posB.y - centerY, 2));
      
// //       return fromCenter ? distA - distB : distB - distA;
// //     });
    
// //     // Animate them sequentially
// //     this.sequential(sortedElements, duration);
// //   },
  
// //   // Spiral pattern - lights spiral inward or outward
// //   spiral: function(lightElements, duration = 6000) {
// //     const centerX = 0;
// //     const centerY = 5;
// //     const totalElements = lightElements.length;
// //     const delayPerElement = duration / totalElements;
    
// //     // Sort by angle and distance combined to create spiral effect
// //     const sortedElements = [...lightElements].sort((a, b) => {
// //       const posA = a.getAttribute('position');
// //       const posB = b.getAttribute('position');
      
// //       const angleA = Math.atan2(posA.y - centerY, posA.x - centerX);
// //       const angleB = Math.atan2(posB.y - centerY, posB.x - centerX);
      
// //       const distA = Math.sqrt(Math.pow(posA.x - centerX, 2) + Math.pow(posA.y - centerY, 2));
// //       const distB = Math.sqrt(Math.pow(posB.x - centerX, 2) + Math.pow(posB.y - centerY, 2));
      
// //       // Combine angle and distance for sorting
// //       return (angleA * 10 + distA) - (angleB * 10 + distB);
// //     });
    
// //     // Animate them sequentially
// //     this.sequential(sortedElements, duration);
// //   },
  
// //   // Alternating pattern - odd/even lights
// //   alternating: function(lightElements, duration = 3000, interval = 1000) {
// //     // Split into odd and even indexed elements
// //     const oddElements = lightElements.filter((_, i) => i % 2 !== 0);
// //     const evenElements = lightElements.filter((_, i) => i % 2 === 0);
    
// //     const toggleGroups = () => {
// //       // Toggle visibility
// //       oddElements.forEach(el => {
// //         el.setAttribute('visible', !el.getAttribute('visible'));
// //         if (el.getAttribute('visible')) {
// //           el.setAttribute('animation', {
// //             property: 'scale',
// //             from: '0.8 0.8 0.8',
// //             to: '1 1 1',
// //             dur: interval / 2,
// //             easing: 'easeOutElastic'
// //           });
// //         }
// //       });
      
// //       evenElements.forEach(el => {
// //         el.setAttribute('visible', !el.getAttribute('visible'));
// //         if (el.getAttribute('visible')) {
// //           el.setAttribute('animation', {
// //             property: 'scale',
// //             from: '0.8 0.8 0.8',
// //             to: '1 1 1',
// //             dur: interval / 2,
// //             easing: 'easeOutElastic'
// //           });
// //         }
// //       });
// //     };
    
// //     // Start with all elements off
// //     lightElements.forEach(el => el.setAttribute('visible', false));
    
// //     // Start with even elements on
// //     evenElements.forEach(el => el.setAttribute('visible', true));
    
// //     // Set interval for toggling
// //     const intervalId = setInterval(toggleGroups, interval);
    
// //     // Clear interval after duration
// //     setTimeout(() => {
// //       clearInterval(intervalId);
// //       // Make all visible at the end
// //       lightElements.forEach(el => el.setAttribute('visible', true));
// //     }, duration);
// //   },
  
// //   // Circular pattern - lights up in circular waves
// //   circular: function(lightElements, duration = 7000) {
// //     const centerX = 0;
// //     const centerY = 5;
// //     const totalElements = lightElements.length;
    
// //     // Group elements in distance bands from center
// //     const bands = {};
// //     const bandSize = 1; // Size of each distance band
    
// //     lightElements.forEach(el => {
// //       const pos = el.getAttribute('position');
// //       const dist = Math.sqrt(Math.pow(pos.x - centerX, 2) + Math.pow(pos.y - centerY, 2));
// //       const bandIndex = Math.floor(dist / bandSize);
      
// //       if (!bands[bandIndex]) bands[bandIndex] = [];
// //       bands[bandIndex].push(el);
// //     });
    
// //     // Sort bands by distance from center
// //     const sortedBandKeys = Object.keys(bands).sort((a, b) => parseInt(a) - parseInt(b));
    
// //     // Timing
// //     const delayPerBand = duration / sortedBandKeys.length;
    
// //     // Animate each band sequentially
// //     sortedBandKeys.forEach((bandIndex, i) => {
// //       setTimeout(() => {
// //         bands[bandIndex].forEach(el => {
// //           el.setAttribute('visible', true);
// //           el.setAttribute('animation', {
// //             property: 'material.emissiveIntensity',
// //             from: 0.5,
// //             to: 1,
// //             dur: 500,
// //             dir: 'alternate',
// //             loop: 1
// //           });
// //         });
// //       }, i * delayPerBand);
// //     });
// //   },
  
// //   // Buddha-centric pattern - emphasizes the Buddha image in center
// //   buddhaCentric: function(lightElements, frameElements, duration = 10000) {
// //     // First light the Buddha area
// //     const centerX = 0;
// //     const centerY = 5;
// //     const centerElements = lightElements.filter(el => {
// //       const pos = el.getAttribute('position');
// //       const dist = Math.sqrt(Math.pow(pos.x - centerX, 2) + Math.pow(pos.y - centerY, 2));
// //       return dist < 3; // Center circle area
// //     });
    
// //     // Make Buddha visible first with special effect
// //     const buddhaElement = document.querySelector('#buddha-image');
// //     buddhaElement.setAttribute('visible', true);
// //     buddhaElement.setAttribute('animation', {
// //       property: 'material.emissiveIntensity',
// //       from: 0,
// //       to: 0.8,
// //       dur: 2000,
// //       easing: 'easeInOutQuad'
// //     });
    
// //     // Then light center elements
// //     setTimeout(() => {
// //       centerElements.forEach(el => {
// //         el.setAttribute('visible', true);
// //         el.setAttribute('animation', {
// //           property: 'material.emissiveIntensity',
// //           from: 0.5,
// //           to: 1,
// //           dur: 1000,
// //           dir: 'alternate',
// //           loop: 1
// //         });
// //       });
// //     }, 2000);
    
// //     // Then light each Jataka frame in sequence
// //     setTimeout(() => {
// //       frameElements.forEach((frame, index) => {
// //         setTimeout(() => {
// //           // Light up the frame
// //           frame.setAttribute('visible', true);
// //           frame.setAttribute('animation', {
// //             property: 'scale',
// //             from: '0.9 0.9 0.9',
// //             to: '1 1 1',
// //             dur: 500,
// //             easing: 'easeOutElastic'
// //           });
          
// //           // Light up surrounding elements
// //           const framePos = frame.getAttribute('position');
// //           const surroundingLights = lightElements.filter(el => {
// //             const pos = el.getAttribute('position');
// //             const dist = Math.sqrt(Math.pow(pos.x - framePos.x, 2) + Math.pow(pos.y - framePos.y, 2));
// //             return dist < 2; // Lights near this frame
// //           });
          
// //           surroundingLights.forEach(el => {
// //             el.setAttribute('visible', true);
// //             el.setAttribute('animation', {
// //               property: 'material.emissiveIntensity',
// //               from: 0.5,
// //               to: 1,
// //               dur: 500,
// //               dir: 'alternate',
// //               loop: 2
// //             });
// //           });
// //         }, index * 800); // Sequence timing for each frame
// //       });
// //     }, 3000);
// //   },
  
// //   // Special festive pattern - combination of multiple effects
// //   festive: function(lightElements, duration = 15000) {
// //     // First all off
// //     lightElements.forEach(el => el.setAttribute('visible', false));
    
// //     // Stage 1: Radial pattern from center outward
// //     setTimeout(() => this.radial(lightElements, true, 3000), 0);
    
// //     // Stage 2: All off, then sequential
// //     setTimeout(() => {
// //       lightElements.forEach(el => el.setAttribute('visible', false));
// //       setTimeout(() => this.sequential(lightElements, 3000), 500);
// //     }, 3500);
    
// //     // Stage 3: All off, then alternating
// //     setTimeout(() => {
// //       lightElements.forEach(el => el.setAttribute('visible', false));
// //       setTimeout(() => this.alternating(lightElements, 3000, 500), 500);
// //     }, 7500);
    
// //     // Stage 4: All on with twinkling effect
// //     setTimeout(() => {
// //       lightElements.forEach(el => {
// //         el.setAttribute('visible', true);
        
// //         // Random twinkling
// //         const twinkle = () => {
// //           const randomDelay = Math.random() * 2000;
// //           setTimeout(() => {
// //             el.setAttribute('animation', {
// //               property: 'material.emissiveIntensity',
// //               from: 0.5,
// //               to: 1,
// //               dur: 300 + Math.random() * 700,
// //               dir: 'alternate',
// //               loop: 1,
// //               easing: 'easeInOutSine'
// //             });
            
// //             // Recursive with randomized delay
// //             if (Math.random() > 0.3) twinkle();
// //           }, randomDelay);
// //         };
        
// //         twinkle();
// //       });
// //     }, 11000);
// //   }
// // };

// // // Function to create dot bulbs in patterns similar to the image
// // function createThoranaDotLights() {
// //   const thorana = document.querySelector('#thorana');
// //   const dotLights = [];
// //   const frameElements = [];
  
// //   // Create circular patterns of dots
// //   function createCircularPattern(centerX, centerY, radius, count, color, startAngle = 0, endAngle = Math.PI * 2) {
// //     const lights = [];
// //     const angleStep = (endAngle - startAngle) / count;
    
// //     for (let i = 0; i < count; i++) {
// //       const angle = startAngle + i * angleStep;
// //       const x = centerX + radius * Math.cos(angle);
// //       const y = centerY + radius * Math.sin(angle);
      
// //       const light = document.createElement('a-entity');
// //       light.setAttribute('geometry', 'primitive: sphere; radius: 0.05');
// //       light.setAttribute('material', `color: ${color}; emissive: ${color}; emissiveIntensity: 1`);
// //       light.setAttribute('position', `${x} ${y} 0.5`);
// //       light.setAttribute('light', `type: point; color: ${color}; intensity: 0.3; decay: 2; distance: 0.5`);
      
// //       thorana.appendChild(light);
// //       lights.push(light);
// //       dotLights.push(light);
// //     }
    
// //     return lights;
// //   }
  
// //   // Create border patterns around frames
// //   function createFrameBorder(x, y, width, height, color, dotSpacing = 0.1) {
// //     const lights = [];
// //     const halfWidth = width / 2;
// //     const halfHeight = height / 2;
    
// //     // Calculate number of dots on each side
// //     const dotsOnWidth = Math.floor(width / dotSpacing);
// //     const dotsOnHeight = Math.floor(height / dotSpacing);
    
// //     // Top edge
// //     for (let i = 0; i < dotsOnWidth; i++) {
// //       const xPos = x - halfWidth + i * dotSpacing;
// //       const light = document.createElement('a-entity');
// //       light.setAttribute('geometry', 'primitive: sphere; radius: 0.04');
// //       light.setAttribute('material', `color: ${color}; emissive: ${color}; emissiveIntensity: 1`);
// //       light.setAttribute('position', `${xPos} ${y + halfHeight} 0.5`);
// //       light.setAttribute('light', `type: point; color: ${color}; intensity: 0.2; decay: 2; distance: 0.3`);
      
// //       thorana.appendChild(light);
// //       lights.push(light);
// //       dotLights.push(light);
// //     }
    
// //     // Bottom edge
// //     for (let i = 0; i < dotsOnWidth; i++) {
// //       const xPos = x - halfWidth + i * dotSpacing;
// //       const light = document.createElement('a-entity');
// //       light.setAttribute('geometry', 'primitive: sphere; radius: 0.04');
// //       light.setAttribute('material', `color: ${color}; emissive: ${color}; emissiveIntensity: 1`);
// //       light.setAttribute('position', `${xPos} ${y - halfHeight} 0.5`);
// //       light.setAttribute('light', `type: point; color: ${color}; intensity: 0.2; decay: 2; distance: 0.3`);
      
// //       thorana.appendChild(light);
// //       lights.push(light);
// //       dotLights.push(light);
// //     }
    
// //     // Left edge
// //     for (let i = 1; i < dotsOnHeight - 1; i++) {
// //       const yPos = y - halfHeight + i * dotSpacing;
// //       const light = document.createElement('a-entity');
// //       light.setAttribute('geometry', 'primitive: sphere; radius: 0.04');
// //       light.setAttribute('material', `color: ${color}; emissive: ${color}; emissiveIntensity: 1`);
// //       light.setAttribute('position', `${x - halfWidth} ${yPos} 0.5`);
// //       light.setAttribute('light', `type: point; color: ${color}; intensity: 0.2; decay: 2; distance: 0.3`);
      
// //       thorana.appendChild(light);
// //       lights.push(light);
// //       dotLights.push(light);
// //     }
    
// //     // Right edge
// //     for (let i = 1; i < dotsOnHeight - 1; i++) {
// //       const yPos = y - halfHeight + i * dotSpacing;
// //       const light = document.createElement('a-entity');
// //       light.setAttribute('geometry', 'primitive: sphere; radius: 0.04');
// //       light.setAttribute('material', `color: ${color}; emissive: ${color}; emissiveIntensity: 1`);
// //       light.setAttribute('position', `${x + halfWidth} ${yPos} 0.5`);
// //       light.setAttribute('light', `type: point; color: ${color}; intensity: 0.2; decay: 2; distance: 0.3`);
      
// //       thorana.appendChild(light);
// //       lights.push(light);
// //       dotLights.push(light);
// //     }
    
// //     return lights;
// //   }
  
// //   // Create decorative swirl patterns
// //   function createSwirlPattern(centerX, centerY, startRadius, endRadius, turns, count, color) {
// //     const lights = [];
// //     const radiusStep = (endRadius - startRadius) / count;
// //     const angleStep = turns * 2 * Math.PI / count;
    
// //     for (let i = 0; i < count; i++) {
// //       const radius = startRadius + i * radiusStep;
// //       const angle = i * angleStep;
      
// //       const x = centerX + radius * Math.cos(angle);
// //       const y = centerY + radius * Math.sin(angle);
      
// //       const light = document.createElement('a-entity');
// //       light.setAttribute('geometry', 'primitive: sphere; radius: 0.05');
// //       light.setAttribute('material', `color: ${color}; emissive: ${color}; emissiveIntensity: 1`);
// //       light.setAttribute('position', `${x} ${y} 0.5`);
// //       light.setAttribute('light', `type: point; color: ${color}; intensity: 0.2; decay: 2; distance: 0.4`);
      
// //       thorana.appendChild(light);
// //       lights.push(light);
// //       dotLights.push(light);
// //     }
    
// //     return lights;
// //   }
  
// //   // Create dharmachakra (wheel of dharma) patterns
// //   function createDharmachakraPattern(centerX, centerY, radius, spokesCount, color) {
// //     const lights = [];
// //     const angleStep = 2 * Math.PI / spokesCount;
    
// //     // Create outer rim
// //     createCircularPattern(centerX, centerY, radius, spokesCount * 5, color);
    
// //     // Create inner hub
// //     createCircularPattern(centerX, centerY, radius * 0.2, spokesCount, color);
    
// //     // Create spokes
// //     for (let i = 0; i < spokesCount; i++) {
// //       const angle = i * angleStep;
      
// //       // Points along the spoke
// //       for (let j = 1; j < 9; j++) {
// //         const r = radius * (0.2 + j * 0.09);
// //         const x = centerX + r * Math.cos(angle);
// //         const y = centerY + r * Math.sin(angle);
        
// //         const light = document.createElement('a-entity');
// //         light.setAttribute('geometry', 'primitive: sphere; radius: 0.05');
// //         light.setAttribute('material', `color: ${color}; emissive: ${color}; emissiveIntensity: 1`);
// //         light.setAttribute('position', `${x} ${y} 0.5`);
// //         light.setAttribute('light', `type: point; color: ${color}; intensity: 0.2; decay: 2; distance: 0.4`);
        
// //         thorana.appendChild(light);
// //         lights.push(light);
// //         dotLights.push(light);
// //       }
// //     }
    
// //     return lights;
// //   }
  
// //   // Create Buddha image with aura
// //   function createBuddhaImage(x, y, width, height) {
// //     // Buddha image
// //     const buddhaImage = document.createElement('a-entity');
// //     buddhaImage.setAttribute('id', 'buddha-image');
// //     buddhaImage.setAttribute('geometry', 'primitive: plane; width: 3; height: 3');
// //     buddhaImage.setAttribute('material', 'transparent: true; src: #jataka4; shader: flat');
// //     buddhaImage.setAttribute('position', `${x} ${y} 0.2`);
    
// //     thorana.appendChild(buddhaImage);
    
// //     // Create concentric aura circles around Buddha
// //     const auraColors = ['#4CAF50', '#8BC34A', '#CDDC39', '#FFEB3B'];
// //     auraColors.forEach((color, index) => {
// //       const radius = 2 + index * 0.5;
// //       createCircularPattern(x, y, radius, 30 + index * 10, color);
// //     });
    
// //     return buddhaImage;
// //   }
  
// //   // Create Jataka tale frames in the layout seen in the image
// //   function createJatakaFrames() {
// //     // Frame positions - matching the 8-frame diamond pattern in the image
// //     const framePositions = [
// //       { x: 0, y: 8, shape: 'diamond' },      // Top
// //       { x: -5, y: 5, shape: 'square' },      // Left
// //       { x: 5, y: 5, shape: 'square' },       // Right
// //       { x: -7, y: 0, shape: 'diamond' },     // Left Middle
// //       { x: 7, y: 0, shape: 'diamond' },      // Right Middle
// //       { x: -5, y: -5, shape: 'square' },     // Bottom Left
// //       { x: 5, y: -5, shape: 'square' },      // Bottom Right
// //       { x: 0, y: -8, shape: 'diamond' }      // Bottom
// //     ];
    
// //     // Create each frame
// //     framePositions.forEach((pos, index) => {
// //       // Frame size
// //       const size = pos.shape === 'diamond' ? 2.5 : 2.2;
      
// //       // Create frame entity
// //       const frame = document.createElement('a-entity');
// //       frame.setAttribute('id', `jataka-frame-${index + 1}`);
// //       frame.setAttribute('position', `${pos.x} ${pos.y} 0.3`);
      
// //       // Add image inside frame
// //       const frameImage = document.createElement('a-plane');
// //       frameImage.setAttribute('width', size * 0.8);
// //       frameImage.setAttribute('height', size * 0.8);
// //       frameImage.setAttribute('material', `src: #jataka${index + 1}; shader: flat`);
// //       frameImage.setAttribute('position', '0 0 0.01');
      
// //       // Add frame border - different for diamond vs square
// //       const frameBorder = document.createElement('a-entity');
      
// //       if (pos.shape === 'diamond') {
// //         frameBorder.setAttribute('geometry', `primitive: plane; width: ${size}; height: ${size}`);
// //         frameBorder.setAttribute('rotation', '0 0 45');
// //       } else {
// //         frameBorder.setAttribute('geometry', `primitive: plane; width: ${size}; height: ${size}`);
// //       }
      
// //       frameBorder.setAttribute('material', 'color: #873600; metalness: 0.3; roughness: 0.7');
// //       frameBorder.setAttribute('position', '0 0 0');
      
// //       // Add frame number
// //       const frameNumber = document.createElement('a-text');
// //       frameNumber.setAttribute('value', `${index + 1}`);
// //       frameNumber.setAttribute('color', 'white');
// //       frameNumber.setAttribute('align', 'center');
// //       frameNumber.setAttribute('position', '0 0 0.02');
// //       frameNumber.setAttribute('scale', '0.5 0.5 0.5');
      
// //       // Add lights around the frame
// //       const frameColor = ['#FFEB3B', '#FFC107', '#FF9800', '#FF5722'][index % 4];
// //       createFrameBorder(pos.x, pos.y, size, size, frameColor, 0.15);
      
// //       // Assemble frame
// //       frame.appendChild(frameBorder);
// //       frame.appendChild(frameImage);
// //       frame.appendChild(frameNumber);
// //       thorana.appendChild(frame);
// //       frameElements.push(frame);
// //     });
    
// //     return frameElements;
// //   }
  
// //   // Create footer area with name and flags
// //   function createFooter() {
// //     // Footer background
// //     const footer = document.createElement('a-entity');
// //     footer.setAttribute('id', 'footer');
// //     footer.setAttribute('position', '0 -11 0.3');
    
// //     // Background plane
// //     const footerBg = document.createElement('a-plane');
// //     footerBg.setAttribute('width', 14);
// //     footerBg.setAttribute('height', 2);
// //     footerBg.setAttribute('color', '#FF9800');
    
// //     // Text area
// //     const textArea = document.createElement('a-entity');
// //     textArea.setAttribute('position', '3 0 0.01');
    
// //     // Sinhala text (using Latin characters for compatibility)
// //     const sinhalaText = document.createElement('a-text');
// //     sinhalaText.setAttribute('value', 'තොරණ බුදු චරිතය');
// //     sinhalaText.setAttribute('font', 'https://cdn.glitch.me/3176f9bd-5957-4d55-a3d0-6ca6ec489be0%2FNotoSansSinhala-Regular.ttf');
// //     sinhalaText.setAttribute('color', '#800000');
// //     sinhalaText.setAttribute('align', 'center');
// //     sinhalaText.setAttribute('position', '0 0.3 0');
// //     sinhalaText.setAttribute('scale', '0.8 0.8 0.8');
    
// //     // Credit text
// //     const creditText = document.createElement('a-text');
// //     creditText.setAttribute('value', 'Making By - Omindu Dissanayake');
// //     creditText.setAttribute('color', '#800000');
// //     creditText.setAttribute('align', 'center');
// //     creditText.setAttribute('position', '0 -0.3 0');
// //     creditText.setAttribute('scale', '0.6 0.6 0.6');
    
// //     // Flag area
// //     const flagArea = document.createElement('a-entity');
// //     flagArea.setAttribute('position', '-3 0 0.01');
    
// //     // Sri Lanka flag (approximated as a red rectangle for simplicity)
// //     const flag = document.createElement('a-plane');
// //     flag.setAttribute('width', 3);
// //     flag.setAttribute('height', 1.5);
// //     flag.setAttribute('color', '#D70026');
// //     flag.setAttribute('position', '0 0 0');
    
// //     // Assemble footer
// //     textArea.appendChild(sinhalaText);
// //     textArea.appendChild(creditText);
// //     flagArea.appendChild(flag);
// //     footer.appendChild(footerBg);
// //     footer.appendChild(textArea);
// //     footer.appendChild(flagArea);
// //     thorana.appendChild(footer);
    
// //     // Add decorative dharmachakras on sides
// //     createDharmachakraPattern(-6, -11, 1, 8, '#FFD700');
// //     createDharmachakraPattern(6, -11, 1, 8, '#FFD700');
    
// //     // Add dotted border around footer
// //     createFrameBorder(0, -11, 14, 2, '#FFFFFF', 0.2);
// //   }
  
// //   // Main function to create the entire thorana light display
// //   function createThoranaLights() {
// //     // Create Buddha image at center
// //     createBuddhaImage(0, 0, 3, 3);
    
// //     // Create main outer circle
// //     createCircularPattern(0, 0, 12, 120, '#FFFFFF');
    
// //     // Create decorative patterns
// //     createSwirlPattern(0, 0, 4, 10, 3, 80, '#FFFFFF');
    
// //     // Create secondary circles
// //     createCircularPattern(0, 0, 8, 80, '#FFFFFF');
    
// //     // Create Jataka frames
// //     createJatakaFrames();
    
// //     // Create footer
// //     createFooter();
    
// //     return { dotLights, frameElements };
// //   }
  
// //   // Create all lights
// //   const thoranaElements = createThoranaLights();
  
// //   // Set all lights invisible initially
// //   thoranaElements.dotLights.forEach(light => light.setAttribute('visible', false));
// //   thoranaElements.frameElements.forEach(frame => frame.setAttribute('visible', false));
  
// //   return thoranaElements;
// // }

// // // Initialize the patterns when the scene is loaded
// // document.addEventListener('DOMContentLoaded', function() {
// //   setTimeout(() => {
// //     // Create thorana lights after the scene is loaded
// //     const thoranaElements = createThoranaDotLights();
    
// //     // Function to play different light patterns based on time or interaction
// //     function playLightPatterns() {
// //       // Get current time to control patterns
// //       const now = new Date();
// //       const hours = now.getHours();
// //       const minutes = now.getMinutes();
      
// //       // Reset visibility - all off
// //       thoranaElements.dotLights.forEach(light => light.setAttribute('visible', false));
      
// //       // Play different patterns based on time
// //       if (hours >= 17 || hours < 6) { // Night time (5 PM to 6 AM)
// //         // Choose pattern based on minutes
// //         const patternIndex = Math.floor(minutes / 10) % 6;
        
// //         switch (patternIndex) {
// //           case 0:
// //             lightingPatterns.sequential(thoranaElements.dotLights, 5000);
// //             setTimeout(() => {
// //               lightingPatterns.buddhaCentric(thoranaElements.dotLights, thoranaElements.frameElements, 10000);
// //             }, 5500);
// //             break;
// //           case 1:
// //             lightingPatterns.radial(thoranaElements.dotLights, true, 4000);
// //             setTimeout(() => {
// //               lightingPatterns.radial(thoranaElements.dotLights, false, 4000);
// //             }, 5000);
// //             break;
// //           case 2:
// //             lightingPatterns.circular(thoranaElements.dotLights, 7000);
// //             break;
// //           case 3:
// //             lightingPatterns.spiral(thoranaElements.dotLights, 6000);
// //             break;
// //           case 4:
// //             lightingPatterns.alternating(thoranaElements.dotLights, 8000, 800);
// //             break;
// //           case 5:
// //             lightingPatterns.festive(thoranaElements.dotLights, 15000);
// //             break;
// //         }
        
// //         // Schedule the next pattern
// //         setTimeout(playLightPatterns, 20000);
// //       } else {
// //         // During daytime, keep minimal lighting or off
// //         // Maybe a subtle pattern that repeats occasionally
// //         lightingPatterns.sequential(thoranaElements.dotLights.filter((_, i) => i % 5 === 0), 10000);
        
// //         // Check again in 5 minutes during day
// //         setTimeout(playLightPatterns, 300000);
// //       }
// //     }
    
// //     // Start the light patterns
// //     playLightPatterns();
    
// //     // Add manual interaction for light patterns
// //     const scene = document.querySelector('a-scene');
// //     scene.addEventListener('click', function() {
// //       // Reset all lights
// //       thoranaElements.dotLights.forEach(light => light.setAttribute('visible', false));
      
// //       // Play a random festive pattern on click
// //       lightingPatterns.festive(thoranaElements.dotLights, 15000);
// //     });
// //   }, 2000);
// // });
