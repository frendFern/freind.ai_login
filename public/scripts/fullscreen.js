(function(d, script) {
    script = d.createElement('script');
    script.setAttribute('disable-devtool-auto','');
    script.type = 'text/javascript';
    script.onload = function(){
        // remote script has loaded
        
    };
    
    
    const frend_params = new Proxy(new URLSearchParams(window.parent.location.search), {
      get: (searchParams, prop) => searchParams.get(prop),
    });
    if(frend_params.d != 1) {
      script.src = 'https://cdn.jsdelivr.net/npm/disable-devtool';
      d.getElementsByTagName('head')[0].appendChild(script);
    }
  }(document));

(function(){
    const profileLink = document.getElementById("frend-profile")
    const exploreLink = document.getElementById("frend-explore")
    const frendSelector = document.getElementById("frend-selector")

    const exploreMenu = document.getElementById("frend-explore-menu")
    const profileMenu = document.getElementById("frend-profile-menu")
    const frendSelectorMenu = document.getElementById("frend-selector-menu")

    const closeMenus = document.querySelectorAll('.close-menu');

    closeMenus.forEach(el => el.addEventListener('click', event => {
        profileMenu.classList.add('hidden')
        exploreMenu.classList.add('hidden')
        frendSelectorMenu.classList.add('hidden')
    }));

    profileLink.onclick=function(){
        profileMenu.classList.toggle('hidden')
        exploreMenu.classList.add('hidden')
        frendSelectorMenu.classList.add('hidden')
    }
    exploreLink.onclick=function(){
        exploreMenu.classList.toggle('hidden')
        profileMenu.classList.add('hidden')
        frendSelectorMenu.classList.add('hidden')
    }
    frendSelector.onclick=function(){
        frendSelectorMenu.classList.toggle('hidden')
        profileMenu.classList.add('hidden')
        exploreMenu.classList.add('hidden')
    }
})()