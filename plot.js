var plots = plots || {};

/// Plot base class
///
/// Args:
///  canvas: Optional canvas DOM element
///  options: Optional specifications
plots.Plot = function(options, canvas) {
  options = options || {};
  this._settings = {
    width: options.width || 400,
    height: options.height || 300,
    margin: options.margin || 2,
    axis_thickness: options.axis_thickness || 2,
    font_size: options.font_size || 14,
  };

  this.canvas = canvas || document.createElement("canvas");
  this.canvas.width = this._settings.width;
  this.canvas.height = this._settings.height;
  this.context = this.canvas.getContext("2d");
  this.context.font = this._settings.font_size + "px monospace";
};

/// Fill text with a specified alignment
///
/// Args:
///  text: Actual text to draw
///  x: Depends on alignment, either left, center or right of text
///  y: Baseline of the text
///  align: Left, right or center
plots.Plot.prototype._fill_text = function(text, x, y, align) {
  align = align || "left";
  text = text.toString();
  var width = this.context.measureText(text).width;
  if(align === "center") {
    x -= width / 2;
  }
  else if(align === "right") {
    x -= width;
  }
  this.context.fillText(text, x, y);
};
