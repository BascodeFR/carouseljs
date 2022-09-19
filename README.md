# Librairie Javascript qui permet de mettre en place un carousel sur le site

Pour mettre en place le carousel:

``` document.addEventListener('DOMContentLoaded', function() {  
  new Carousel(document.querySelector("#carousel"), {  
      slidesToScroll: 10,  
      slidesVisible: 10,  
      pagination: true  
  })  
}) 
```
