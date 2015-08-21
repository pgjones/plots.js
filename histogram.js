var plots = plots || {};


/// Produce a histogram on a canvas DOM element.
///
/// Args:
///  data: A list of bins in the following format (example values)
///        [{'label': '4', 'value': 20}]
///  options: Associate array of optional settings, including:
///    width: Optional plot width, defaults to 300px
///    height: Optional plot height, defaults to 400px
///    margin: Margin between any part of the plot and the edge, and within the plot
plots.Histogram = function(data, options, canvas) {
  options = options || {};
  this._settings = {
    width: options.width || 400,
    height: options.height || 300,
    axis_size: options.axis_size || 20,
    margin: options.margin || 2,
    axis_thickness: options.axis_thickness || 2,
    color: 'red',
  };
  this._data = data;
  // Calculate extra settings
  var max_value = 1;
  var longest_label = 1;
  for(var ibin = 0; ibin < this._data.length; ibin++) {
    max_value = Math.max(max_value, this._data[ibin].value);
    longest_label = Math.max(longest_label, this._data[ibin].label.length);
  }
  this._settings.max_value = max_value;
  this._settings.bar_width = (this._settings.width - this._settings.axis_size) / this._data.length;
  // Create the canvas and draw the plot
  this.canvas = canvas || document.createElement("canvas");
  this.canvas.width = this._settings.width;
  this.canvas.height = this._settings.height;
  this.context = this.canvas.getContext("2d");
  this._draw_axis();
  this._draw_data();
};


/// Draws the axis onto the canvas
plots.Histogram.prototype._draw_axis = function() {
  this.context.save();
  var font_args = this.context.font.split(' ');
  this.context.font = this._settings.axis_size + "px " + font_args[font_args.length - 1];
  this.context.strokeStyle = "Black";
  this.context.lineWidth = 2;
  // The vertical axis
  this.context.beginPath();
  this.context.moveTo(this._settings.axis_size, this._settings.margin);
  this.context.lineTo(this._settings.axis_size, this._settings.height - this._settings.axis_size);
  this.context.stroke();
  this.context.closePath();
  this.context.fillText(this._settings.max_value, this._settings.margin, this._settings.margin + this._settings.axis_size);
  this.context.fillText("0", this._settings.margin, this._settings.height - this._settings.axis_size);

  // The horizontal axis
  this.context.beginPath();
  this.context.moveTo(this._settings.axis_size,
                      this._settings.height - this._settings.axis_size);
  this.context.lineTo(this._settings.width - this._settings.margin,
                      this._settings.height - this._settings.axis_size);
  this.context.stroke();
  this.context.closePath();

  for(var ibin = 0; ibin < this._data.length; ibin++) {
    var x = this._settings.axis_size + ibin * this._settings.bar_width + this._settings.bar_width / 2;
    this.context.fillText(this._data[ibin].label, x, this._settings.height - this._settings.margin);
  }
  this.context.restore();
};

/// Draws the data onto the canvas
plots.Histogram.prototype._draw_data = function() {
  this.context.save();
  var max_bar_height = this._settings.height - this._settings.axis_size - this._settings.margin;
  for(var ibin = 0; ibin < this._data.length; ibin++) {
    var x = this._settings.axis_size + this._settings.margin + ibin * this._settings.bar_width;

    this.context.fillStyle = this._settings.color;

    this.context.fillRect(x, (this._settings.max_value - this._data[ibin].value) * max_bar_height / this._settings.max_value,
                          this._settings.bar_width - 2 * this._settings.margin,
                          this._data[ibin].value * max_bar_height / this._settings.max_value);
  }
  this.context.restore();
};
