//Expression for line's highlights.
  //Path:
  const {createBox} = footage("eBox.jsx").sourceData;
const {layerRect} = footage('aefunctions.jsx').sourceData.getFunctions();
t = effect("Text Layer")("Slider")
const textLayer = thisComp.layer(index-1);
const textRect = layerRect({layer:textLayer, anchor:'center',});
p=effect("Padding")("Slider");

const myBox = createBox({
	size:add(textRect.size, [p,p]),
	position: textRect.position,
	anchor: 'center',
});
myBox.setScale([100, 100], "center");
myBox.getPath();

//Expressions for word highlights:
//Path:
const {createBox} = footage("eBox.jsx").sourceData;
const {layerRect} = footage('aefunctions.jsx').sourceData.getFunctions();
t = effect("Text Layer")("Slider")
const textLayer = thisComp.layer(index-t+1);
const textRect = layerRect({layer:textLayer, anchor:'center',});
p=effect("Padding")("Slider");

const myBox = createBox({
	size:add(textRect.size, [p,p]),
	position: textRect.position,
	anchor: 'center',
});
myBox.setScale([100, 100], "center");
myBox.getPath();

//Text Layer Slider:
const {animate} = footage("eKeys.jsx").sourceData;
var duration = thisLayer.outPoint - thisLayer.inPoint;

var targetLayer = thisComp.layer(index+1);
var textSource = targetLayer.text.sourceText.value;
var wordArray = textSource.split(/[\s-]+/);
w=parseInt(wordArray.length+1, 10);

const keys = [
  {
    keyTime: thisLayer.inPoint,
    keyValue: [w],
    easeIn: 0,
    easeOut: 0,
  },
  {
    keyTime: thisLayer.outPoint,
    keyValue: [1],
    easeIn: 0,
    easeOut: 0,
  },
];

animate(keys);
