export { ResizeElement }

function ResizeElement({
        element,
        minWidth = 30,
        minHeight = 30,
        maxWidth = 0,
        maxHeight = 0,
        size = 20,
        left = false,
        top = false,
        right = false,
        bottom = false,
})
{
    element.style.position = "absolute"
    if(top)
    {
        MakeTopResizable()
    }

    if(bottom)
    {
        MakeBottomResizable()
    }

    if(left)
    {
        MakeLeftResizable()
    }

    if(right)
    {
        MakeRightResizable()
    }

    if(left && top)
    {
        MakeTopLeftResizable()
    }

    if(right && top)
    {
        MakeTopRightResizable()
    }

    if(left && bottom)
    {
        MakeBottomLeftResizable()
    }

    if(right && bottom)
    {
        MakeBottomRightResizable()
    }

    function MakeTopResizable()
    {
      const top = <div></div>

      prevent(top)

      top
        .$style({'width': '100%'})
        .$style({'height': size + 'px'})
        .$style({'backgroundColor': 'transparent'})
        .$style({'position': 'absolute'})
        .$style({'top': - (size/2) + 'px'})
        .$style({'left': '0px'})
        .$style({'cursor': 'n-resize'})
  
        .$on('mousedown',resizeYNegative())
        
        .$parent(element)
    }
    
    function MakeBottomResizable()
    {
      const bottom = <div></div>

      prevent(bottom)

      bottom
        .$style({'width': '100%'})
        .$style({'height': size + 'px'})
        .$style({'backgroundColor': 'transparent'})
        .$style({'position': 'absolute'})
        .$style({'bottom': - (size/2) + 'px'})
        .$style({'left': '0px'})
        .$style({'cursor': 'n-resize'})
  
        .$on('mousedown',resizeYPositive())
  
        .$parent(element)
    }

    function MakeLeftResizable()
    {
      const left = <div></div>

      prevent(left)

      left
      .$style({'width': size + 'px'})
      .$style({'height': '100%'})
      .$style({'backgroundColor': 'transparent'})
      .$style({'position': 'absolute'})
      .$style({'top': '0px'})
      .$style({'left': - (size/2) + 'px'})
      .$style({'cursor': 'e-resize'})

      .$on('mousedown',resizeXNegative())

      .$parent(element)
    }

    function MakeRightResizable()
    {
      const right = <div></div>

      prevent(right)

      right
      .$style({'width':size + 'px'})
      .$style({'height':'100%'})
      .$style({'backgroundColor':'transparent'})
      .$style({'position':'absolute'})
      .$style({'top':'0px'})
      .$style({'right':- (size/2) + 'px'})
      .$style({'cursor':'e-resize'})

      .$on('mousedown',resizeXPositive())

      .$parent(element)
    }

    function MakeTopLeftResizable()
    {
      const corner1 = <div></div>

      prevent(corner1)

      corner1
      .$style({'width':size + 'px'})
      .$style({'height':size + 'px'})
      .$style({'backgroundColor':'transparent'})
      .$style({'position':'absolute'})
      .$style({'top':- (size/2) + 'px'})
      .$style({'left':- (size/2) + 'px'})
      .$style({'cursor':'nw-resize'})
      
      .$on('mousedown',resizeXNegative())
      .$on('mousedown',resizeYNegative())
      
      .$parent(element)
    }

    function MakeTopRightResizable()
    {
      const corner2 = <div></div>

      prevent(corner2)

      corner2
      .$style({'width': size + 'px'})
      .$style({'height': size + 'px'})
      .$style({'backgroundColor': 'transparent'})
      .$style({'position': 'absolute'})
      .$style({'top': - (size/2) + 'px'})
      .$style({'right': - (size/2) + 'px'})
      .$style({'cursor': 'ne-resize'})

      .$on('mousedown',resizeXPositive())
      .$on('mousedown',resizeYNegative())

      .$parent(element)
    }


    function MakeBottomLeftResizable()
    {
      const corner3 = <div></div>

      prevent(corner3)

      corner3.$style({'width': size + 'px'})
      .$style({'height': size + 'px'})
      .$style({'backgroundColor': 'transparent'})
      .$style({'position': 'absolute'})
      .$style({'bottom': - (size/2) + 'px'})
      .$style({'left': - (size/2) + 'px'})
      .$style({'cursor': 'sw-resize'})

      .$on('mousedown',resizeXNegative())
      .$on('mousedown',resizeYPositive())

      .$parent(element)
    }

    function MakeBottomRightResizable()
    {
      const corner4 = <div></div>
      
      prevent(corner4)

      corner4.$style({'width': size + 'px'})
      .$style({'height': size + 'px'})
      .$style({'backgroundColor': 'transparent'})
      .$style({'position': 'absolute'})
      .$style({'bottom': - (size/2) + 'px'})
      .$style({'right': - (size/2) + 'px'})
      .$style({'cursor': 'se-resize'})

      .$on('mousedown',resizeXPositive())
      .$on('mousedown',resizeYPositive())

      .$parent(element)
    }

    
    function resizeXPositive()
    {
        let offsetX
        function dragMouseDown(e) {
            if(e.button !== 0) return
            e = e || window.event;
            e.preventDefault();
            const {clientX} = e;
            offsetX = clientX - element.offsetLeft - parseInt(element.$getComputedStyle('width'));
            document.addEventListener('mouseup', closeDragElement)
            document.addEventListener('mousemove', elementDrag)
          }
        
          function elementDrag(e) {
                const {clientX} = e;
                let x = clientX - element.offsetLeft - offsetX

                if(x < minWidth && minWidth != 0) x = minWidth;
                if(x > maxWidth && maxWidth != 0) x = maxWidth;
                element.$style({'width':  x + 'px'});
          }
        
          function closeDragElement() {
            document.removeEventListener("mouseup", closeDragElement);  
            document.removeEventListener("mousemove", elementDrag);
          }
        return dragMouseDown
    }

    function resizeYPositive()
    {
        let offsetY
        function dragMouseDown(e) {
            if(e.button !== 0) return
            e = e || window.event;
            e.preventDefault();
            const {clientY} = e;
            offsetY = clientY - element.offsetTop -  parseInt(element.$getComputedStyle('height'));
    
            document.addEventListener('mouseup',closeDragElement)
            document.addEventListener('mousemove',elementDrag)
          }
        
          function elementDrag(e) {
                const {clientY} = e;
                let y =  clientY - element.offsetTop - offsetY;
                if(y < minHeight && minHeight != 0) y = minHeight;
                if(y > maxHeight && maxHeight != 0) y = maxHeight;
                element.$style({'height': y + 'px'});
          }
        
          function closeDragElement() {
            document.removeEventListener("mouseup", closeDragElement);  
            document.removeEventListener("mousemove", elementDrag);
          }
        return dragMouseDown
    }

    function resizeXNegative()
    {
        let offsetX
        let startX
        let startW
        let maxX
        let minX
        function dragMouseDown(e) {
            if(e.button !== 0) return
            e = e || window.event;
            e.preventDefault();
            const {clientX} = e;
            startX = parseInt(element.$getComputedStyle('left'))
            startW = parseInt(element.$getComputedStyle('width'))
            offsetX = clientX - startX;
            maxX = startX + startW - minWidth
            minX = startX + startW - maxWidth
    
            document.addEventListener('mouseup',closeDragElement)
            document.addEventListener('mousemove',elementDrag)
          }
        
          function elementDrag(e) {
                const {clientX} = e;
                let x = clientX - offsetX
                let w = startW + startX - x
                if(w < minWidth && minWidth != 0) w = minWidth;
                if(w > maxWidth && maxWidth != 0) w = maxWidth
                if(x > maxX && minWidth != 0) x = maxX;
                if(x < minX && maxWidth != 0) x = minX;
                element.$style({'left': x + 'px'})
                       .$style({'width': w + 'px'});
          }
        
          function closeDragElement() {
            document.removeEventListener("mouseup", closeDragElement);  
            document.removeEventListener("mousemove", elementDrag);
          }
        return dragMouseDown
    }

    function resizeYNegative()
    {
        let offsetY
        let startY
        let startH
        let maxY
        let minY
        function dragMouseDown(e) {
            if(e.button !== 0) return
            e = e || window.event;
            e.preventDefault();
            const {clientY} = e;
            startY = parseInt(element.$getComputedStyle('top'))
            startH = parseInt(element.$getComputedStyle('height'))
            offsetY = clientY - startY;
            maxY = startY + startH - minHeight 
            minY = startY + startH - maxHeight 
    
            document.addEventListener('mouseup',closeDragElement,false)
            document.addEventListener('mousemove',elementDrag,false)
          }
        
          function elementDrag(e) {
                const {clientY} = e;
                let y =  clientY - offsetY
                let h = startH + startY - y
                if(h < minHeight && minHeight != 0) h = minHeight;
                if(h > maxHeight && maxHeight != 0) h = maxHeight;
                if(y > maxY && minHeight != 0) y = maxY;
                if(y < minY  && maxHeight != 0) y = minY;
                element
                    .$style({'top': y + 'px'})
                    .$style({'height': h + 'px'})
          }
        
          function closeDragElement() {
            document.removeEventListener("mouseup", closeDragElement);  
            document.removeEventListener("mousemove", elementDrag);
          }
        return dragMouseDown
    }
}

function prevent(element)
{
  element.$on("mousedown",e=>{
    e.preventDefault();
    e.stopPropagation();
  })
}