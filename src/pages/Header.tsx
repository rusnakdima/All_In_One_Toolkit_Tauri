import React from "react";

import { MenuOutline, SunnyOutline, MoonOutline } from "react-ionicons";

class Header extends React.Component {

  componentDidMount(): void {
    document.addEventListener('click', (event: any) => {
      if(event.target.parentElement != null){
        if((event.target.nodeName != "path" && event.target.parentElement.nodeName != "svg") && (event.target.nodeName != "svg" && event.target.parentElement.parentElement.id != "menuBut")){
            this.closeNav();
        }
      } else {
        this.closeNav();
      }
    });
    
    const ancAll = document.querySelectorAll("#menuBack a");
    ancAll.forEach(item => {
      item.addEventListener('click', () => {
        this.closeNav();
      });
    });
  }
  
  handleTheme(theme: string) {
    localStorage["theme"] = theme;
    document.querySelector("html")?.setAttribute("class", theme);
  }
  
  openNav() {
    const menuBack = document.querySelector("#menuBack") as HTMLDivElement | null;
    if(menuBack != null){
      menuBack.classList.add("block");
      menuBack.classList.remove("-translate-x-full");
      menuBack.children[0].classList.remove("-translate-x-full");
    }
  }
  
  closeNav() {
    const menuBack = document.querySelector("#menuBack") as HTMLDivElement | null;
    if(menuBack != null){
      menuBack.children[0].classList.add("-translate-x-full");
      setTimeout(() => {
        menuBack.classList.add("-translate-x-full");
        menuBack.classList.remove("block");
      }, 160);
    };
  }

  render() {
    return (
      <div className="styleHeader">
        <div className="flex flex-row" id="menuBut">
          <MenuOutline cssClasses="text-black dark:text-white !w-[35px] !h-[35px]" onClick={() => {this.openNav()}} />
        </div>
        <div>
          <SunnyOutline cssClasses="block dark:hidden text-black dark:text-white !w-[35px] !h-[35px]" onClick={() => {this.handleTheme('dark')}} />
          <MoonOutline cssClasses="hidden dark:block text-black dark:text-white !w-[35px] !h-[35px]" onClick={() => {this.handleTheme('')}} />
        </div>
      </div>
    );
  };
};

export default Header;