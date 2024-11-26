type StylesDictionary = Record<string, string>;

class StyleManager {
    private currentStyle: string | null; 
    private styles: StylesDictionary;

    constructor(styles: StylesDictionary) {
        this.currentStyle = null; 
        this.styles = styles;

       
        this.createStyleLinks();

        this.setupEventListeners();
    }

    private createStyleLinks(): void {
        
        let navElement = document.querySelector('nav');
        if (!navElement) {
            navElement = document.createElement('nav');
            document.body.prepend(navElement);
        }

        // Iteracja po stylach i tworzenie linków
        Object.keys(this.styles).forEach(style => {
            const link = document.createElement('a');
            link.textContent = `${style}`; 
            link.href = '#'; 
            link.setAttribute('data-style', style); 
            link.classList.add('style-link');
            navElement.appendChild(link); 
        });
    }


    private applyStyle(style: string): void {
        console.log('Zmiana stylu na:', style);

     
        if (!this.styles[style]) {
            console.error(`Style '${style}' not found in styles dictionary.`);
            return;
        }

       
        const existingLink = document.querySelector('link#current-style') as HTMLLinkElement;

        if (existingLink) {
            existingLink.remove(); 
        }

        
        const newLink = document.createElement('link');
        newLink.rel = 'stylesheet';
        newLink.href = this.styles[style];
        newLink.id = 'current-style';
        document.head.appendChild(newLink);

        
        this.currentStyle = style;
    }

    // Ustaw nasłuchiwacze na kliknięcia w linki
    private setupEventListeners(): void {
        
        const styleLinks = document.querySelectorAll('a[data-style]');

        styleLinks.forEach(link => {
            link.addEventListener('click', (event) => {
                event.preventDefault(); 

                const target = event.target as HTMLAnchorElement;
                const newStyle = target.getAttribute('data-style');

                if (newStyle) {
                   
                    this.applyStyle(newStyle);
                }
            });
        });
    }
}


const styles: StylesDictionary = {
    'css1': 'style/page1.css',
    'css2': 'style/page2.css',
    'czerwone': 'style/page3.css',


    
};

new StyleManager(styles);
