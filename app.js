document.addEventListener('DOMContentLoaded', () => {
    // --- Slide Navigation Engine ---
    const slides = document.querySelectorAll('.slide');
    const hudCounter = document.getElementById('hud-counter');
    const hudTitle = document.getElementById('hud-slide-title');
    const progressBar = document.getElementById('progress-bar');
    const btnPrev = document.getElementById('btn-hud-prev');
    const btnNext = document.getElementById('btn-hud-next');
    const btnFullscreen = document.getElementById('btn-hud-fullscreen');

    let currentSlideIndex = 0;

    function goToSlide(index) {
        if (index < 0 || index >= slides.length) return;

        // Transition slide active class
        slides[currentSlideIndex].classList.remove('active');
        currentSlideIndex = index;
        slides[currentSlideIndex].classList.add('active');

        // Scroll to top of the slide
        slides[currentSlideIndex].scrollTop = 0;

        // Update HUD
        const activeSlide = slides[currentSlideIndex];
        const title = activeSlide.getAttribute('data-title') || 'Präsentation';
        if (hudTitle) hudTitle.textContent = title;
        if (hudCounter) hudCounter.textContent = `${currentSlideIndex + 1} / ${slides.length}`;

        // The progress bar is now used as a stealth 10-minute timer triggered by fullscreen
    }

    // Nav Remote Click handlers
    btnPrev.addEventListener('click', () => goToSlide(currentSlideIndex - 1));
    btnNext.addEventListener('click', () => goToSlide(currentSlideIndex + 1));

    // Keyboard controls
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowRight' || e.key === ' ') {
            e.preventDefault();
            goToSlide(currentSlideIndex + 1);
        } else if (e.key === 'ArrowLeft') {
            e.preventDefault();
            goToSlide(currentSlideIndex - 1);
        }
    });

    // Stealth Timer Variables
    let presentationTimer = null;
    let presentationStartTime = 0;
    const TOTAL_TIME_MS = 7 * 60 * 1000; // 7 minutes

    function startPresentationTimer() {
        if (presentationTimer) return; // Already running
        
        // Reset bar
        if (progressBar) {
            progressBar.style.width = '0%';
            progressBar.style.background = 'linear-gradient(90deg, var(--accent-purple), var(--accent-cyan))';
        }
        
        presentationStartTime = Date.now();
        
        presentationTimer = setInterval(() => {
            const elapsed = Date.now() - presentationStartTime;
            let pct = (elapsed / TOTAL_TIME_MS) * 100;
            if (pct > 100) pct = 100;
            
            if (progressBar) {
                progressBar.style.width = `${pct}%`;
                
                // Color cues: Orange at 80%, Red at 90%
                if (pct > 90) { 
                    progressBar.style.background = '#ef4444'; // Red
                } else if (pct > 80) { 
                    progressBar.style.background = '#f97316'; // Orange
                }
            }
            
            if (pct >= 100) clearInterval(presentationTimer);
        }, 1000);
    }

    // Fullscreen Mode Handler
    document.addEventListener('fullscreenchange', () => {
        if (document.fullscreenElement) {
            btnFullscreen.innerHTML = '<i class="lucide-minimize"></i>';
            startPresentationTimer();
        } else {
            btnFullscreen.innerHTML = '<i class="lucide-maximize"></i>';
        }
        // Re-init icon if needed
        if (typeof lucide !== 'undefined') lucide.createIcons();
    });

    btnFullscreen.addEventListener('click', () => {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch(err => {
                console.error(`Fehler beim Aktivieren des Vollbildmodus: ${err.message}`);
            });
        } else {
            document.exitFullscreen();
        }
    });

    // Initialize slide HUD
    goToSlide(0);


    // --- Widget 1: Timeline Handler (Slide 2) ---
    const timeNodes = document.querySelectorAll('.time-node');
    const timePanels = document.querySelectorAll('.timeline-panel');

    timeNodes.forEach(node => {
        node.addEventListener('click', () => {
            const index = node.getAttribute('data-index');
            
            timeNodes.forEach(n => n.classList.remove('active'));
            timePanels.forEach(p => p.classList.remove('active'));

            node.classList.add('active');
            document.getElementById(`time-panel-${index}`).classList.add('active');
        });
    });


    // --- Widget 2: Flashcard Flip (Slide 2) ---
    const flashcard = document.getElementById('deck-flashcard');
    if (flashcard) {
        flashcard.addEventListener('click', () => {
            flashcard.classList.toggle('flipped');
        });
    }


    // --- Widget 3: Image Gallery Lightbox (Slide 7) ---
    const galleryItems = document.querySelectorAll('.gallery-item');
    const lightbox = document.getElementById('image-lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxCaptionTitle = document.getElementById('lightbox-caption-title');
    const lightboxCaptionDesc = document.getElementById('lightbox-caption-desc');
    const btnLightboxClose = document.getElementById('btn-lightbox-close');

    galleryItems.forEach(item => {
        item.addEventListener('click', () => {
            const imgPath = item.getAttribute('data-img');
            const title = item.getAttribute('data-title');
            const desc = item.getAttribute('data-desc');

            lightboxImg.src = imgPath;
            lightboxCaptionTitle.textContent = title;
            lightboxCaptionDesc.textContent = desc;

            lightbox.classList.add('open');
        });
    });

    btnLightboxClose.addEventListener('click', () => {
        lightbox.classList.remove('open');
    });

    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            lightbox.classList.remove('open');
        }
    });


    // --- Widget 4: Coding IDE Simulator (Slide 8) ---
    const fileItems = document.querySelectorAll('.file-item');
    const editorActiveFilename = document.getElementById('editor-active-filename');
    const editorCodeBody = document.getElementById('editor-code-body');
    const btnIdeExecute = document.getElementById('btn-ide-execute');
    const consoleHistory = document.getElementById('console-history');
    const plotPlaceholder = document.getElementById('plot-placeholder');
    const plotImage = document.getElementById('plot-image');
    
    const outputTabs = document.querySelectorAll('.output-tab');
    const outputPanels = document.querySelectorAll('.output-panel');

    const fileCodes = {
        'automated_literature_search.py': 
`<span class="kw">from</span> selenium <span class="kw">import</span> webdriver
<span class="kw">from</span> selenium.webdriver.common.by <span class="kw">import</span> By
<span class="kw">import</span> time
<span class="kw">import</span> os

<span class="kw">def</span> <span class="fn">starte_literatursuche</span>(stichwort, anzahl_ergebnisse):
    <span class="com"># Chrome WebDriver initialisieren</span>
    options = webdriver.ChromeOptions()
    <span class="com"># Diese Zeile blendet die internen USB- und GCM-Fehler in der Konsole aus</span>
    options.add_experimental_option(<span class="str">'excludeSwitches'</span>, [<span class="str">'enable-logging'</span>])
    
    driver = webdriver.Chrome(options=options)
    
    gesammelte_artikel = []
    suchbegriff_url = stichwort.replace(<span class="str">" "</span>, <span class="str">"+"</span>)

    <span class="fn">print</span>(<span class="kw">f</span><span class="str">"Starte Suche für: '{stichwort}'..."</span>)

    <span class="com"># 1. GOOGLE SCHOLAR</span>
    <span class="fn">print</span>(<span class="str">"Durchsuche Google Scholar..."</span>)
    <span class="kw">try</span>:
        driver.get(<span class="kw">f</span><span class="str">"https://scholar.google.com/scholar?q={suchbegriff_url}"</span>)
        time.sleep(<span class="num">2</span>)

        scholar_results = driver.find_elements(By.CSS_SELECTOR, <span class="str">".gs_ri"</span>)
        
        <span class="kw">for</span> artikel <span class="kw">in</span> scholar_results[:anzahl_ergebnisse]:
            <span class="kw">try</span>:
                titel_element = artikel.find_element(By.CSS_SELECTOR, <span class="str">"h3 a"</span>)
                titel = titel_element.text
                link = titel_element.get_attribute(<span class="str">"href"</span>)
                autor = artikel.find_element(By.CSS_SELECTOR, <span class="str">".gs_a"</span>).text

                gesammelte_artikel.append({
                    <span class="str">"Quelle"</span>: <span class="str">"Google Scholar"</span>,
                    <span class="str">"Titel"</span>: titel,
                    <span class="str">"Autor"</span>: autor,
                    <span class="str">"Link"</span>: link
                })
            <span class="kw">except</span> Exception:
                <span class="kw">continue</span>
    <span class="kw">except</span> Exception <span class="kw">as</span> e:
        <span class="fn">print</span>(<span class="kw">f</span><span class="str">"Fehler bei Google Scholar: {e}"</span>)

    <span class="com"># 2. WILEY ONLINE LIBRARY</span>
    <span class="fn">print</span>(<span class="str">"Durchsuche Wiley..."</span>)
    <span class="kw">try</span>:
        wiley_url = <span class="kw">f</span><span class="str">"https://onlinelibrary.wiley.com/action/doSearch?AllField={suchbegriff_url}&amp;pageSize={anzahl_ergebnisse}"</span>
        driver.get(wiley_url)
        time.sleep(<span class="num">3</span>)

        wiley_results = driver.find_elements(By.CSS_SELECTOR, <span class="str">".search__item"</span>)
        
        <span class="kw">for</span> artikel <span class="kw">in</span> wiley_results[:anzahl_ergebnisse]:
            <span class="kw">try</span>:
                titel_element = artikel.find_element(By.CSS_SELECTOR, <span class="str">"a.publication_title"</span>)
                titel = titel_element.text
                link = titel_element.get_attribute(<span class="str">"href"</span>)
                autor = artikel.find_element(By.CSS_SELECTOR, <span class="str">".author-style"</span>).text
                
                gesammelte_artikel.append({
                    <span class="str">"Quelle"</span>: <span class="str">"Wiley"</span>,
                    <span class="str">"Titel"</span>: titel,
                    <span class="str">"Autor"</span>: autor,
                    <span class="str">"Link"</span>: link
                })
            <span class="kw">except</span> Exception:
                <span class="kw">continue</span>
    <span class="kw">except</span> Exception <span class="kw">as</span> e:
        <span class="fn">print</span>(<span class="kw">f</span><span class="str">"Fehler bei Wiley: {e}"</span>)

    driver.quit()

    <span class="com"># 3. DATEN IM DOWNLOADS-ORDNER SPEICHERN</span>
    downloads_pfad = os.path.join(os.path.expanduser(<span class="str">"~"</span>), <span class="str">"Downloads"</span>)
    dateiname = os.path.join(downloads_pfad, <span class="kw">f</span><span class="str">"Literatursuche_{stichwort.replace(' ', '_')}.txt"</span>)
    
    <span class="fn">print</span>(<span class="kw">f</span><span class="str">"Speichere {len(gesammelte_artikel)} gefundene Artikel in: {dateiname}"</span>)

    <span class="kw">with</span> <span class="fn">open</span>(dateiname, <span class="str">"w"</span>, encoding=<span class="str">"utf-8"</span>) <span class="kw">as</span> datei:
        datei.write(<span class="kw">f</span><span class="str">"LITERATURSUCHE FÜR: {stichwort}\\n"</span>)
        datei.write(<span class="str">"="</span>*<span class="num">50</span> + <span class="str">"\\n\\n"</span>)
        
        <span class="kw">for</span> idx, artikel <span class="kw">in</span> <span class="fn">enumerate</span>(gesammelte_artikel, <span class="num">1</span>):
            datei.write(<span class="kw">f</span><span class="str">"--- Artikel {idx} [{artikel['Quelle']}] ---\\n"</span>)
            datei.write(<span class="kw">f</span><span class="str">"Titel:           {artikel['Titel']}\\n"</span>)
            datei.write(<span class="kw">f</span><span class="str">"Autor(en):       {artikel['Autor']}\\n"</span>)
            datei.write(<span class="kw">f</span><span class="str">"Link:            {artikel['Link']}\\n"</span>)
            datei.write(<span class="str">"\\n"</span> + <span class="str">"-"</span>*<span class="num">50</span> + <span class="str">"\\n\\n"</span>)

    <span class="fn">print</span>(<span class="str">"Vorgang erfolgreich abgeschlossen!"</span>)

<span class="com"># PROGRAMM STARTEN</span>
<span class="kw">if</span> __name__ == <span class="str">"__main__"</span>:
    suchbegriff = <span class="fn">input</span>(<span class="str">"Bitte Stichwort für die Suche eingeben: "</span>)
    anzahl = <span class="fn">int</span>(<span class="fn">input</span>(<span class="str">"Gewünschte Anzahl an Ergebnissen pro Suchmaschine: "</span>))
    
    <span class="fn">starte_literatursuche</span>(suchbegriff, anzahl)
`,
        'analyse.R': 
`<span class="com"># Notwendige Bibliotheken laden</span>
<span class="kw">library</span>(dplyr)
<span class="kw">library</span>(ggplot2)
<span class="kw">library</span>(scales)

<span class="com"># 1. Daten über den lokalen Pfad importieren</span>
youtube_data &lt;- <span class="fn">read.csv</span>(<span class="str">"C:/Users/Dangi/Desktop/Präsentation/Datenbank/DEvideos.csv"</span>)

<span class="com"># 2. Fehlerhafte Daten entfernen</span>
youtube_clean &lt;- youtube_data %&gt;%
  <span class="fn">filter</span>(!<span class="fn">is.na</span>(Category) &amp; !<span class="fn">is.na</span>(Views) &amp; !<span class="fn">is.na</span>(Subscribers))

<span class="com"># Abbildung 2.13: YouTube-Kategorien nach Aufrufen (Balkendiagramm)</span>
category_data &lt;- youtube_clean %&gt;%
  <span class="fn">group_by</span>(Category) %&gt;%
  <span class="fn">summarise</span>(Total_Views = <span class="fn">as.numeric</span>(<span class="fn">sum</span>(Views))) %&gt;%
  <span class="fn">arrange</span>(<span class="fn">desc</span>(Total_Views))

plot_categories &lt;- <span class="fn">ggplot</span>(category_data, <span class="fn">aes</span>(x = <span class="fn">reorder</span>(Category, -Total_Views), y = Total_Views, fill = Category)) +
  <span class="fn">geom_bar</span>(stat = <span class="str">"identity"</span>) +
  <span class="fn">scale_y_continuous</span>(labels = comma) + 
  <span class="fn">theme</span>(axis.text.x = <span class="fn">element_text</span>(angle = <span class="num">45</span>, hjust = <span class="num">1</span>)) +
  <span class="fn">labs</span>(title = <span class="str">"Views by Category"</span>, x = <span class="str">"Categories"</span>, y = <span class="str">"Views"</span>)

<span class="fn">print</span>(plot_categories)

<span class="com"># Abbildung 2.14: Zusammenhang zwischen Abonnenten und Gesamtaufrufen</span>
plot_correlation &lt;- <span class="fn">ggplot</span>(youtube_clean, <span class="fn">aes</span>(x = Subscribers, y = Views)) +
  <span class="fn">geom_point</span>(size = <span class="num">1</span>) + 
  <span class="fn">geom_smooth</span>(method = <span class="str">"lm"</span>, color = <span class="str">"red"</span>, se = <span class="kw">FALSE</span>, linewidth = <span class="num">1</span>) +
  <span class="fn">scale_x_log10</span>() +
  <span class="fn">scale_y_log10</span>() +
  <span class="fn">labs</span>(title = <span class="str">"Comparison of Number of Subscribers and Views with Regression Line"</span>, x = <span class="str">"Number of Subscribers"</span>, y = <span class="str">"Number of Views"</span>)

<span class="fn">print</span>(plot_correlation)
`,
        'moodle_solver.py': 
`<span class="kw">import</span> os
<span class="kw">import</span> time
<span class="kw">from</span> selenium <span class="kw">import</span> webdriver
<span class="kw">from</span> selenium.webdriver.common.by <span class="kw">import</span> By
<span class="kw">import</span> openai

MOODLE_URL = <span class="str">"https://justlearnit.rgtfo-me.it/moodle/login/index.php"</span>
QUIZ_URL = <span class="str">"https://justlearnit.rgtfo-me.it/moodle/mod/quiz/view.php?id=4192"</span>
openai.api_key = os.getenv(<span class="str">"OPENAI_API_KEY"</span>)

<span class="kw">def</span> <span class="fn">login_to_moodle</span>(driver):
    driver.get(MOODLE_URL)
    driver.find_element(By.ID, <span class="str">"username"</span>).send_keys(<span class="str">"student123"</span>)
    driver.find_element(By.ID, <span class="str">"password"</span>).send_keys(<span class="str">"my_secure_password"</span>)
    driver.find_element(By.ID, <span class="str">"loginbtn"</span>).click()
    time.sleep(<span class="num">2</span>)

<span class="kw">def</span> <span class="fn">extract_questions</span>(driver):
    fragen_texte = []
    fragen = driver.find_elements(By.CSS_SELECTOR, <span class="str">".que"</span>)
    
    <span class="kw">for</span> frage <span class="kw">in</span> fragen:
        text = frage.find_element(By.CSS_SELECTOR, <span class="str">".qtext"</span>).text
        
        math_tags = frage.find_elements(By.CSS_SELECTOR, <span class="str">"script[type='math/tex']"</span>)
        <span class="kw">for</span> tag <span class="kw">in</span> math_tags:
            formel = tag.get_attribute(<span class="str">"innerHTML"</span>)
            text += <span class="kw">f</span><span class="str">" [Formel: {formel}] "</span>
            
        fragen_texte.append(text)
    <span class="kw">return</span> fragen_texte

<span class="kw">def</span> <span class="fn">get_llm_answers</span>(fragen):
    antworten = []
    <span class="kw">for</span> frage <span class="kw">in</span> fragen:
        response = openai.ChatCompletion.create(
            model=<span class="str">"gpt-4o"</span>,
            messages=[
                {<span class="str">"role"</span>: <span class="str">"system"</span>, <span class="str">"content"</span>: <span class="str">"Löse die Aufgabe und nenne nur das Endergebnis."</span>},
                {<span class="str">"role"</span>: <span class="str">"user"</span>, <span class="str">"content"</span>: frage}
            ]
        )
        antworten.append(response.choices[<span class="num">0</span>].message[<span class="str">'content'</span>].strip())
    <span class="kw">return</span> antworten

<span class="kw">def</span> <span class="fn">submit_answers</span>(driver, antworten):
    input_felder = driver.find_elements(By.CSS_SELECTOR, <span class="str">".que input[type='text']"</span>)
    
    <span class="kw">for</span> feld, antwort <span class="kw">in</span> <span class="fn">zip</span>(input_felder, antworten):
        feld.clear()
        feld.send_keys(antwort)
        
    driver.find_element(By.NAME, <span class="str">"next"</span>).click()
    time.sleep(<span class="num">1</span>)
    driver.find_elements(By.CSS_SELECTOR, <span class="str">"button.submitbtn"</span>)[<span class="num">1</span>].click()

<span class="kw">def</span> <span class="fn">main</span>():
    options = webdriver.ChromeOptions()
    options.add_argument(<span class="str">'--headless'</span>)
    driver = webdriver.Chrome(options=options)
    
    <span class="kw">try</span>:
        <span class="fn">login_to_moodle</span>(driver)
        driver.get(QUIZ_URL)
        
        fragen = <span class="fn">extract_questions</span>(driver)
        antworten = <span class="fn">get_llm_answers</span>(fragen)
        <span class="fn">submit_answers</span>(driver, antworten)
        
        <span class="fn">print</span>(<span class="str">"Quiz erfolgreich abgeschlossen!"</span>)
        
    <span class="kw">finally</span>:
        driver.quit()

<span class="kw">if</span> __name__ == <span class="str">"__main__"</span>:
    <span class="fn">main</span>()
`
    };

    let selectedFile = 'automated_literature_search.py';

    function loadFileContent(filename) {
        selectedFile = filename;
        editorActiveFilename.textContent = filename;
        editorCodeBody.innerHTML = fileCodes[filename];
    }

    fileItems.forEach(item => {
        item.addEventListener('click', () => {
            fileItems.forEach(i => i.classList.remove('active'));
            item.classList.add('active');
            loadFileContent(item.getAttribute('data-file'));
        });
    });

    // Output tab switcher
    outputTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            outputTabs.forEach(t => t.classList.remove('active'));
            outputPanels.forEach(p => p.classList.remove('active'));

            tab.classList.add('active');
            const targetTab = tab.getAttribute('data-tab');
            document.getElementById(`panel-${targetTab}`).classList.add('active');
        });
    });

    function switchOutputTab(tabName) {
        outputTabs.forEach(t => t.classList.remove('active'));
        outputPanels.forEach(p => p.classList.remove('active'));

        const activeTab = document.querySelector(`.output-tab[data-tab="${tabName}"]`);
        if (activeTab) activeTab.classList.add('active');
        const activePanel = document.getElementById(`panel-${tabName}`);
        if (activePanel) activePanel.classList.add('active');
    }

    // Load initial code
    loadFileContent('automated_literature_search.py');

    let isExecuting = false;
    async function wait(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // Helper: creates a console input prompt row with text field and submit button
    function createConsolePrompt(promptText) {
        return new Promise(resolve => {
            const row = document.createElement('div');
            row.className = 'console-input-row';

            const label = document.createElement('span');
            label.className = 'console-line-input';
            label.textContent = promptText;

            const input = document.createElement('input');
            input.type = 'text';
            input.className = 'console-text-input';
            input.autocomplete = 'off';

            const btn = document.createElement('button');
            btn.className = 'console-submit-btn';
            btn.innerHTML = '<i class="lucide-corner-down-left"></i> Enter';

            row.appendChild(label);
            row.appendChild(input);
            row.appendChild(btn);
            consoleHistory.appendChild(row);

            // Auto-scroll and focus
            consoleHistory.scrollTop = consoleHistory.scrollHeight;
            input.focus();

            const submit = () => {
                const val = input.value.trim();
                if (!val) return;
                // Freeze the row: replace input+btn with static text
                input.disabled = true;
                btn.disabled = true;
                input.style.opacity = '0.6';
                btn.style.display = 'none';
                resolve(val);
            };

            btn.addEventListener('click', submit);
            input.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') submit();
            });
        });
    }

    // Helper: generates a simulated .txt file and triggers download
    function generateAndDownloadFile(stichwort, anzahl) {
        // Template pools for dynamic paper generation
        const scholarTemplates = [
            'A Comprehensive Review of {kw} in Modern Research',
            'Advances in {kw}: Methods and Applications',
            'Quantitative Analysis of {kw} Parameters',
            '{kw} and Its Impact on Sustainable Development',
            'Machine Learning Approaches for {kw}',
            'Systematic Review of {kw} in Agricultural Science',
            'Novel Frameworks for {kw} Assessment',
            'Comparative Study of {kw} Techniques',
            'The Role of {kw} in Environmental Monitoring',
            'Data-Driven Insights into {kw}',
            'Statistical Modeling of {kw} Dynamics',
            'Recent Developments in {kw} Methodology',
            '{kw}: Challenges and Future Directions',
            'High-Throughput Analysis of {kw}',
            'Integrating {kw} with Remote Sensing Data',
        ];
        const wileyTemplates = [
            'Emerging Trends in {kw} Research',
            'A Meta-Analysis of {kw} Studies',
            'Experimental Validation of {kw} Models',
            'Interdisciplinary Perspectives on {kw}',
            '{kw}: From Theory to Practice',
            'Field-Scale Applications of {kw}',
            'Biogeochemical Aspects of {kw}',
            'Optimizing {kw} for Precision Agriculture',
            '{kw} Under Climate Change Scenarios',
            'Spectroscopic Methods for {kw} Detection',
            'Genetic Variability in {kw} Response',
            'Policy Implications of {kw} Research',
            '{kw} in Arid and Semi-Arid Regions',
            'Long-Term Monitoring of {kw}',
            'Socioeconomic Factors Influencing {kw}',
        ];
        const authorPool = [
            'M. Fischer, L. Gruber', 'A. Berger, T. Hofer', 'K. Wagner, P. Steiner',
            'R. Mair, S. Brunner', 'D. Pichler, H. Eder', 'J. Huber, F. Lang',
            'C. Moser, B. Kofler', 'N. Winkler, E. Bauer', 'G. Schwarz, I. Reiter',
            'W. Gruber, V. Thaler', 'L. Hölzl, M. Rauch', 'F. Mayr, T. Obermair',
            'S. Kerschbaumer, A. Platter', 'P. Unterthiner, K. Leitner', 'E. Brugger, H. Stauder',
        ];
        const journalPool = [
            'Nature Reviews', 'Science Direct', 'PLOS ONE', 'Environmental Research Letters',
            'IEEE Access', 'Frontiers in Plant Science', 'Journal of Agricultural Science',
            'Applied Soil Ecology', 'Geoderma', 'Plant and Soil',
        ];

        const num = parseInt(anzahl);

        let content = `LITERATURSUCHE FÜR: ${stichwort}\n`;
        content += '='.repeat(50) + '\n\n';

        let idx = 1;
        // Google Scholar results
        for (let i = 0; i < num; i++) {
            const tmpl = scholarTemplates[i % scholarTemplates.length];
            const titel = tmpl.replace('{kw}', stichwort);
            const autor = authorPool[i % authorPool.length] + ' - ' + journalPool[i % journalPool.length] + ', ' + (2023 + (i % 3));
            content += `--- Artikel ${idx} [Google Scholar] ---\n`;
            content += `Titel:           ${titel}\n`;
            content += `Autor(en):       ${autor}\n`;
            content += `Link:            https://scholar.google.com/scholar?q=${encodeURIComponent(stichwort)}&result=${i + 1}\n`;
            content += '\n' + '-'.repeat(50) + '\n\n';
            idx++;
        }
        // Wiley results
        for (let i = 0; i < num; i++) {
            const tmpl = wileyTemplates[i % wileyTemplates.length];
            const titel = tmpl.replace('{kw}', stichwort);
            const autor = authorPool[(i + 5) % authorPool.length];
            content += `--- Artikel ${idx} [Wiley] ---\n`;
            content += `Titel:           ${titel}\n`;
            content += `Autor(en):       ${autor}\n`;
            content += `Link:            https://onlinelibrary.wiley.com/doi/10.1002/example${i + 1}\n`;
            content += '\n' + '-'.repeat(50) + '\n\n';
            idx++;
        }

        // Create blob and trigger download
        const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Literatursuche_${stichwort.replace(/\s+/g, '_')}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        return num * 2;
    }

    btnIdeExecute.addEventListener('click', async () => {
        if (isExecuting) return;
        isExecuting = true;

        switchOutputTab('console');
        consoleHistory.innerHTML = '';
        const runInput = document.createElement('div');
        runInput.className = 'console-line-input';
        
        if (selectedFile === 'automated_literature_search.py') {
            runInput.textContent = 'guest@unibz-assistant:~$ python automated_literature_search.py';
            consoleHistory.appendChild(runInput);
            await wait(600);

            // --- Step 1: Ask for search keyword ---
            const stichwort = await createConsolePrompt('Bitte Stichwort für die Suche eingeben: ');
            await wait(400);

            // --- Step 2: Ask for number of results ---
            const anzahlStr = await createConsolePrompt('Gewünschte Anzahl an Ergebnissen pro Suchmaschine: ');
            const anzahl = parseInt(anzahlStr) || 3;
            await wait(500);

            // --- Step 3: Simulate the search ---
            const l1 = document.createElement('div');
            l1.textContent = `Starte Suche für: '${stichwort}'...`;
            consoleHistory.appendChild(l1);
            consoleHistory.scrollTop = consoleHistory.scrollHeight;
            await wait(700);

            const l2 = document.createElement('div');
            l2.textContent = 'Durchsuche Google Scholar...';
            consoleHistory.appendChild(l2);
            consoleHistory.scrollTop = consoleHistory.scrollHeight;
            await wait(1200);

            const l3 = document.createElement('div');
            l3.className = 'console-line-success';
            l3.textContent = `[SUCCESS] ${anzahl} Ergebnisse von Google Scholar gefunden.`;
            consoleHistory.appendChild(l3);
            consoleHistory.scrollTop = consoleHistory.scrollHeight;
            await wait(600);

            const l4 = document.createElement('div');
            l4.textContent = 'Durchsuche Wiley...';
            consoleHistory.appendChild(l4);
            consoleHistory.scrollTop = consoleHistory.scrollHeight;
            await wait(1500);

            const l5 = document.createElement('div');
            l5.className = 'console-line-success';
            l5.textContent = `[SUCCESS] ${anzahl} Ergebnisse von Wiley gefunden.`;
            consoleHistory.appendChild(l5);
            consoleHistory.scrollTop = consoleHistory.scrollHeight;
            await wait(500);

            const l6 = document.createElement('div');
            l6.textContent = 'Browser wird geschlossen...';
            consoleHistory.appendChild(l6);
            consoleHistory.scrollTop = consoleHistory.scrollHeight;
            await wait(400);

            // --- Step 4: Generate & Download file ---
            const totalArticles = generateAndDownloadFile(stichwort, anzahl);

            const l7 = document.createElement('div');
            l7.className = 'console-line-success';
            l7.textContent = `Speichere ${totalArticles} gefundene Artikel in: ~/Downloads/Literatursuche_${stichwort.replace(/\s+/g, '_')}.txt`;
            consoleHistory.appendChild(l7);
            consoleHistory.scrollTop = consoleHistory.scrollHeight;
            await wait(400);

            const l8 = document.createElement('div');
            l8.className = 'console-line-success';
            l8.style.fontWeight = '700';
            l8.textContent = 'Vorgang erfolgreich abgeschlossen!';
            consoleHistory.appendChild(l8);
            consoleHistory.scrollTop = consoleHistory.scrollHeight;
        } 
        else if (selectedFile === 'analyse.R') {
            runInput.textContent = 'guest@unibz-assistant:~$ Rscript analyse.R';
            consoleHistory.appendChild(runInput);
            await wait(600);

            const l1 = document.createElement('div');
            l1.textContent = 'Lade benötigte R-Bibliotheken (dplyr, ggplot2, scales)...';
            consoleHistory.appendChild(l1);
            await wait(800);

            const l2 = document.createElement('div');
            l2.textContent = 'Importiere DEvideos.csv...';
            consoleHistory.appendChild(l2);
            await wait(600);

            const l3 = document.createElement('div');
            l3.textContent = 'Bereinige fehlerhafte Daten...';
            consoleHistory.appendChild(l3);
            await wait(500);

            const l4 = document.createElement('div');
            l4.textContent = 'Berechne Gesamtaufrufe pro Kategorie...';
            consoleHistory.appendChild(l4);
            await wait(700);

            const l5 = document.createElement('div');
            l5.className = 'console-line-success';
            l5.textContent = '[INFO] Erstelle Balkendiagramm (Views by Category)...';
            consoleHistory.appendChild(l5);
            await wait(500);

            const l6 = document.createElement('div');
            l6.className = 'console-line-success';
            l6.textContent = '[INFO] Erstelle Streudiagramm mit Regressionsgerade...';
            consoleHistory.appendChild(l6);
            await wait(600);
            
            const l7 = document.createElement('div');
            l7.className = 'console-line-success';
            l7.textContent = '[SUCCESS] Grafiken erfolgreich gerendert!';
            consoleHistory.appendChild(l7);

            // Render plot image
            plotPlaceholder.style.display = 'none';
            plotImage.style.display = 'block';

            await wait(800);
            switchOutputTab('plot');
        } 
        else if (selectedFile === 'moodle_solver.py') {
            runInput.textContent = 'guest@unibz-assistant:~$ python moodle_solver.py';
            consoleHistory.appendChild(runInput);
            await wait(600);

            const selOverlay = document.getElementById('selenium-browser');
            const selUrl = document.getElementById('selenium-url');
            const selContent = document.getElementById('selenium-content');

            const l1 = document.createElement('div');
            l1.textContent = '[INFO] Initialisiere Chrome WebDriver...';
            consoleHistory.appendChild(l1);
            await wait(800);

            // Open overlay
            selOverlay.classList.add('active');
            selUrl.textContent = 'https://justlearnit.rgtfo-me.it/moodle/login/index.php';
            selContent.innerHTML = `
                <div class="mock-moodle-login">
                    <div class="mock-moodle-logo">justlearnit Moodle</div>
                    <input type="text" class="mock-input" id="mock-user" placeholder="Anmeldename">
                    <input type="password" class="mock-input" id="mock-pwd" placeholder="Kennwort">
                    <button class="mock-btn" id="mock-login-btn">Login</button>
                </div>
            `;
            await wait(800);
            
            // Simulate typing
            const mockUser = document.getElementById('mock-user');
            const mockPwd = document.getElementById('mock-pwd');
            const mockBtn = document.getElementById('mock-login-btn');
            
            mockUser.classList.add('typing');
            mockUser.value = 'student123';
            await wait(400);
            mockUser.classList.remove('typing');
            
            mockPwd.classList.add('typing');
            mockPwd.value = '********';
            await wait(400);
            mockPwd.classList.remove('typing');
            
            mockBtn.classList.add('clicking');
            await wait(300);

            const l2 = document.createElement('div');
            l2.textContent = '[INFO] Verbinde mit justlearnit.rgtfo-me.it/moodle... Login erfolgreich.';
            consoleHistory.appendChild(l2);
            await wait(600);

            // Navigate to quiz
            selUrl.textContent = 'https://justlearnit.rgtfo-me.it/moodle/mod/quiz/view.php?id=4192';
            selContent.innerHTML = `
                <div class="mock-quiz">
                    <div class="mock-quiz-header">Mathematik I - Probe (ID: 4192)</div>
                    <div class="mock-question">
                        <div class="mock-q-text">Frage 1: In einer großen Box befinden sich 9 blaue, 8 hellrote, 3 dunkelrote, 7 grüne, 3 braune und 5 gelbe Farbstifte. Es wird blind ein Farbstift herausgeholt. Mit welcher Wahrscheinlichkeit wird ein gelber oder roter Stift gezogen? Runde auf 2 Nachkommastellen!</div>
                        <input type="text" class="mock-ans-input" id="mock-ans-1" disabled>
                    </div>
                    <div class="mock-question">
                        <div class="mock-q-text">Frage 2: Das Symmetriezentrum der Funktion <i>f(x) = x<sup>3</sup> + 6x<sup>2</sup> - 14</i> hat die Koordinaten:</div>
                        <input type="text" class="mock-ans-input" id="mock-ans-2" disabled>
                    </div>
                    <div class="mock-question">
                        <div class="mock-q-text">Frage 3: Bestimme die spezielle Lösung der folgenden DGL für <i>y(0) = -8</i><br><br><i>y' + 5xy = 0</i><br><br><i>y(x) = </i></div>
                        <input type="text" class="mock-ans-input" id="mock-ans-3" disabled>
                    </div>
                </div>
            `;

            const l3 = document.createElement('div');
            l3.textContent = '[INFO] Extrahiere 3 Fragen. Gefundene TeX-Formeln: f(x)=x^3+6x^2-14, y\'+5xy=0';
            consoleHistory.appendChild(l3);
            await wait(700);

            const l4 = document.createElement('div');
            l4.style.color = '#fde047';
            l4.textContent = '[API] Sende Fragen an OpenAI (gpt-4o)... Warte auf Antwort...';
            consoleHistory.appendChild(l4);
            await wait(2200);

            const l5 = document.createElement('div');
            l5.style.color = '#c4b5fd';
            l5.textContent = '[API] Antwort nach 2.2s erhalten: "0.46", "(-2|2)", "-8*e^(-2.5*x^2)"';
            consoleHistory.appendChild(l5);
            await wait(500);

            const l6 = document.createElement('div');
            l6.className = 'console-line-success';
            l6.textContent = '[INFO] Trage Antworten in Moodle ein und gebe Versuch ab...';
            consoleHistory.appendChild(l6);
            
            // Type answers
            const mockAns1 = document.getElementById('mock-ans-1');
            const mockAns2 = document.getElementById('mock-ans-2');
            const mockAns3 = document.getElementById('mock-ans-3');
            
            mockAns1.classList.add('typing');
            mockAns1.value = '0.46';
            await wait(400);
            mockAns1.classList.remove('typing');
            
            await wait(2000);
            
            mockAns2.classList.add('typing');
            mockAns2.value = '(-2|2)';
            await wait(400);
            mockAns2.classList.remove('typing');

            await wait(2000);

            mockAns3.classList.add('typing');
            mockAns3.value = '-8*e^(-2.5*x^2)';
            await wait(600);
            mockAns3.classList.remove('typing');
            
            await wait(1000);
            
            // Submit
            selContent.innerHTML = `
                <div class="mock-quiz">
                    <div class="mock-quiz-header" style="color: #16a34a;">Quiz abgeschlossen!</div>
                    <div>Bewertung: 100%</div>
                </div>
            `;
            await wait(1200);
            
            // Close overlay
            selOverlay.classList.remove('active');

            const l7 = document.createElement('div');
            l7.className = 'console-line-success';
            l7.style.fontWeight = '700';
            l7.textContent = '[SUCCESS] Quiz erfolgreich mit 100% abgeschlossen!';
            consoleHistory.appendChild(l7);
            consoleHistory.scrollTop = consoleHistory.scrollHeight;
        }

        isExecuting = false;
    });

    // Make the generated plot image clickable using the existing lightbox
    plotImage.style.cursor = 'zoom-in';
    plotImage.addEventListener('click', () => {
        lightboxImg.src = plotImage.src;
        lightboxCaptionTitle.textContent = 'YouTube Datenanalyse';
        lightboxCaptionDesc.textContent = 'Links: Verteilung der Videoaufrufe nach Kategorie. Rechts: Korrelation zwischen Abonnenten und Gesamtaufrufen.';
        lightbox.classList.add('open');
    });
});
