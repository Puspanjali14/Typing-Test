const paragraphs = [
    
    "As a frontend developer, I specialize in crafting intuitive and aesthetic user interfaces that enhance the overall user experience.",
    "My expertise in responsive design allows me to ensure that every website I create functions seamlessly across different devices and screen sizes.",
    "With a strong foundation in HTML, CSS, and JavaScript, I continuously push myself to stay updated with the latest frontend frameworks and technologies.",
    "I thrive in cross-functional teams, collaborating closely with designers and backend developers to create cohesive and high-performing web applications.",
    "My passion for web design drives me to explore innovative solutions and incorporate creative animations that make each project visually engaging and user-friendly."
  ];
  
  let time = 60;
  let timerInterval;
  let wordsTyped = 0;
  let startTime;
  let currentParagraph = '';
  const inputArea = document.getElementById('input-area');
  const textDisplay = document.getElementById('text-display');
  const timerDisplay = document.getElementById('timer');
  const wpmDisplay = document.getElementById('wpm');
  const accuracyDisplay = document.getElementById('accuracy');
  const timeLimitSelect = document.getElementById('time-limit');
  const restartButton = document.getElementById('restart-btn');
  const darkModeButton = document.getElementById('dark-mode-btn');
  const increaseTextSizeButton = document.getElementById('increase-text-size-btn');
  const decreaseTextSizeButton = document.getElementById('decrease-text-size-btn');
  const countdownDisplay = document.getElementById('countdown-display');
  const performanceHistoryContainer = document.getElementById('performance-history');
  
  timeLimitSelect.addEventListener('change', setTimeLimit);
  inputArea.addEventListener('input', startTest);
  restartButton.addEventListener('click', restartTest);
  darkModeButton.addEventListener('click', toggleDarkMode);
  increaseTextSizeButton.addEventListener('click', () => adjustTextSize(true));
  decreaseTextSizeButton.addEventListener('click', () => adjustTextSize(false));
  
  function setTimeLimit() {
    time = parseInt(timeLimitSelect.value);
    timerDisplay.textContent = time;
  }
  
  function getRandomParagraph() {
    const randomIndex = Math.floor(Math.random() * paragraphs.length);
    return paragraphs[randomIndex];
  }
  
  function startTest() {
    if (!timerInterval) {
      startTime = Date.now();
      timerInterval = setInterval(updateTimer, 1000);
    }
  
    const userInput = inputArea.value;
    let displayText = '';
    let userText = userInput.slice(0, currentParagraph.length);
  
    for (let i = 0; i < currentParagraph.length; i++) {
      const char = currentParagraph[i];
      const userChar = userText[i] || '';
      
      if (char === userChar) {
        displayText += `<span class="correct">${char}</span>`;
      } else {
        displayText += `<span class="incorrect">${char}</span>`;
      }
    }
  
    textDisplay.innerHTML = displayText;
  
    if (userInput.endsWith(' ') || userInput.length === currentParagraph.length) {
      wordsTyped++;
    }
  
    updateStats();
  }
  
  function updateTimer() {
    time--;
    timerDisplay.textContent = time;
  
    if (time <= 0) {
      clearInterval(timerInterval);
      inputArea.disabled = true;
      savePerformance();
    }
  }
  
  function updateStats() {
    const elapsedTime = (Date.now() - startTime) / 60000; // Convert milliseconds to minutes
    const wpm = Math.round((wordsTyped / elapsedTime) || 0);
    const accuracy = calculateAccuracy();
  
    wpmDisplay.textContent = wpm;
    accuracyDisplay.textContent = accuracy + '%';
  }
  
  function calculateAccuracy() {
    const totalChars = currentParagraph.length;
    const typedChars = inputArea.value.length;
    const correctChars = inputArea.value.split('').filter((char, index) => char === currentParagraph[index]).length;
    
    return (correctChars / typedChars * 100) || 100;
  }
  
  function restartTest() {
    clearInterval(timerInterval);
    timerInterval = null;
    time = parseInt(timeLimitSelect.value);
    timerDisplay.textContent = time;
    inputArea.value = '';
    inputArea.disabled = false;
    wordsTyped = 0;
    startTime = null;
    currentParagraph = getRandomParagraph();
    textDisplay.innerHTML = currentParagraph;
    updateStats();
    startCountdown(5 * 60); // Example: start a 5-minute countdown
  }
  
  function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
  }
  
  function saveProgress() {
    const userInput = inputArea.value;
    localStorage.setItem('typing-progress', userInput);
  }
  
  function loadProgress() {
    const savedProgress = localStorage.getItem('typing-progress');
    if (savedProgress) {
      inputArea.value = savedProgress;
    }
  }
  
  function adjustTextSize(increase) {
    const textDisplay = document.getElementById('text-display');
    const currentSize = parseFloat(window.getComputedStyle(textDisplay).fontSize);
    const newSize = increase ? currentSize + 2 : currentSize - 2;
    textDisplay.style.fontSize = `${newSize}px`;
  }
  
  
  function startCountdown(duration) {
    let timeLeft = duration;
    countdownDisplay.textContent = formatTime(timeLeft);
    
    const countdownTimer = setInterval(() => {
      timeLeft--;
      countdownDisplay.textContent = formatTime(timeLeft);
      
      if (timeLeft <= 0) {
        clearInterval(countdownTimer);
        alert('Time is up!');
      }
    }, 1000);
  }
  
  function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
  }
  
  // Function to adjust layout based on screen size
  function adjustLayout() {
    const width = window.innerWidth;
    
    // Adjust text size and input area based on screen width
    const textDisplay = document.getElementById('text-display');
    const inputArea = document.getElementById('input-area');
    
    if (width <= 768) { // Mobile devices
      textDisplay.style.fontSize = '1rem';
      inputArea.style.height = '120px';
    } else { // Desktop devices
      textDisplay.style.fontSize = '1.2rem';
      inputArea.style.height = '150px';
    }
  }
  
  // Call adjustLayout on page load and window resize
  window.addEventListener('load', () => {
    adjustLayout();
    loadProgress();
    displayPerformanceHistory();
  });
  window.addEventListener('resize', adjustLayout);
  
  // Initialize with a random paragraph
  currentParagraph = getRandomParagraph();
  textDisplay.innerHTML = currentParagraph;
  