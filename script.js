document.addEventListener('DOMContentLoaded', function() {
	const tabBtns = document.querySelectorAll('.tab-btn');
	const tabSections = document.querySelectorAll('.tab-section');
	const themeToggle = document.querySelector('.theme-toggle');
	const themeIcon = document.querySelector('.theme-icon');
	
	// Skills search functionality
	const skillSearch = document.getElementById('skillSearch');
	const skillCards = document.querySelectorAll('.skill-card');
	
	// Initialize skill levels
	skillCards.forEach(card => {
		const level = card.querySelector('.skill-level');
		if (level) {
			const value = level.dataset.level || '0';
			level.style.setProperty('--level', value + '%');
		}
	});

	// Search functionality
	skillSearch?.addEventListener('input', (e) => {
		const searchText = e.target.value.toLowerCase();
		skillCards.forEach(card => {
			const skillName = card.querySelector('h4').textContent.toLowerCase();
			const categories = (card.dataset.categories || '').toLowerCase();
			const isMatch = skillName.includes(searchText) || categories.includes(searchText);
			card.style.display = isMatch ? 'block' : 'none';
		});
	});

	// Contact form (basic client-side handling)
	const contactForm = document.getElementById('contactForm');
	const formStatus = document.getElementById('formStatus');
	if (contactForm) {
		contactForm.addEventListener('submit', (e) => {
			e.preventDefault();
			const name = contactForm.querySelector('#contactName')?.value.trim();
			const email = contactForm.querySelector('#contactEmail')?.value.trim();
			const message = contactForm.querySelector('#contactMessage')?.value.trim();
			const honeypot = contactForm.querySelector('.honeypot')?.value;

			// basic spam check
			if (honeypot) return; // silently drop

			if (!name || !email || !message) {
				formStatus.textContent = 'Por favor, preencha todos os campos.';
				return;
			}

			// basic email validation
			const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
			if (!emailRe.test(email)) {
				formStatus.textContent = 'Por favor, insira um email válido.';
				return;
			}

			// simulate send (no backend wired)
			formStatus.textContent = 'Enviando...';
			setTimeout(() => {
				formStatus.textContent = 'Obrigado — responderei em até 48h.';
				contactForm.reset();
				setTimeout(() => { if (formStatus) formStatus.textContent = ''; }, 6000);
			}, 800);
		});
	}

	let isDark = false;

	/* Terminal typing animation variables */
	const terminalTextEl = document.querySelector('.terminal-text');
	const terminalPromptEl = document.querySelector('.terminal-prompt');
	const terminalWords = [
		'Front-End',
		'Back-End',
		'Full-Stack',
		'Python',
		'C',
		'JavaScript',
		'HTML',
		'CSS'
	];
	let termCurrent = 0;
	let termChar = 0;
	let termDeleting = false;
	let termRunning = false;
	let termTimeouts = [];
	const TYPING_SPEED = 110;
	const DELETING_SPEED = 50;
	const PAUSE_AFTER_WORD = 1000;

	function clearTermTimeouts() {
		termTimeouts.forEach(t => clearTimeout(t));
		termTimeouts = [];
	}

	function typeLoop() {
		if (!termRunning) return;
		const word = terminalWords[termCurrent];
		if (!termDeleting) {
			// type next char
			terminalTextEl.textContent = word.slice(0, termChar + 1);
			termChar++;
			if (termChar === word.length) {
				// pause then start deleting
				const t = setTimeout(() => {
					termDeleting = true;
					typeLoop();
				}, PAUSE_AFTER_WORD);
				termTimeouts.push(t);
			} else {
				const t = setTimeout(typeLoop, TYPING_SPEED);
				termTimeouts.push(t);
			}
		} else {
			// delete
			terminalTextEl.textContent = word.slice(0, termChar - 1);
			termChar--;
			if (termChar === 0) {
				termDeleting = false;
				termCurrent = (termCurrent + 1) % terminalWords.length;
				const t = setTimeout(typeLoop, TYPING_SPEED);
				termTimeouts.push(t);
			} else {
				const t = setTimeout(typeLoop, DELETING_SPEED);
				termTimeouts.push(t);
			}
		}
	}

	function startTerminal() {
		if (termRunning) return;
		if (!terminalTextEl) return;
		termRunning = true;
		termCurrent = 0;
		termChar = 0;
		termDeleting = false;
		clearTermTimeouts();
		typeLoop();
	}

	function stopTerminal() {
		termRunning = false;
		clearTermTimeouts();
		if (terminalTextEl) terminalTextEl.textContent = '';
	}

	tabBtns.forEach(btn => {
		btn.addEventListener('click', () => {
			// Remove active from all buttons
			tabBtns.forEach(b => b.classList.remove('active'));
			btn.classList.add('active');

			// Hide all sections
			tabSections.forEach(sec => sec.classList.remove('active'));
			const tabId = 'tab-' + btn.dataset.tab;
			document.getElementById(tabId).classList.add('active');

			// Start/stop terminal animation depending on tab
			if (btn.dataset.tab === 'sobre') {
				startTerminal();
			} else {
				stopTerminal();
			}
		});
	});

	// on initial load, start terminal only if Sobre is active
	const activeBtn = document.querySelector('.tab-btn.active');
	if (activeBtn && activeBtn.dataset.tab === 'sobre') startTerminal();

	themeToggle.addEventListener('click', () => {
		// Prevent rapid switching by disabling the button temporarily
		themeToggle.style.pointerEvents = 'none';
		setTimeout(() => {
			themeToggle.style.pointerEvents = 'auto';
		}, 500); // Re-enable after transition completes

		isDark = !isDark;
		themeIcon.src = isDark ? 'assets/8666735_moon_icon.svg' : 'assets/8666699_sun_icon.svg';
		document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
	});
});
