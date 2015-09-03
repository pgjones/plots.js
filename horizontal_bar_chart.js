var plots = plots || {};


/// Produce a Bar Chart on a canvas DOM element, where the bars are horizontal
///
/// Args:
///  data: A list of bins in the following format (example values)
///        [{'label': '4', 'value': 20}]
///  options: Associate array of optional settings, including:
///    width: Optional plot width, defaults to 300px
///    height: Optional plot height, defaults to 400px
///    margin: Margin between any part of the plot and the edge, and within the plot
plots.HorizontalBarChart = function(data, options, canvas) {
  plots.Plot.call(this, options, canvas);
  options = options || {};
  this._settings.color = options.color || 'red';
  this._settings.x_label = options.x_label || 'Count';

  this._data = data;
  // Calculate extra settings
  var max_value = 1;
  var longest_label = 1;
  for(var ibin = 0; ibin < this._data.length; ibin++) {
    max_value = Math.max(max_value, this._data[ibin].value);
    longest_label = Math.max(longest_label, this._data[ibin].label.length);
  }
  this._settings.max_value = max_value;
  // Resize the font until it fits
  this._settings.vertical_axis_size = longest_label * this._settings.font_size;
  this._settings.horizontal_axis_size = this._settings.font_size * 2.0;
  this._settings.bar_height = (this._settings.height - this._settings.horizontal_axis_size) / this._data.length;

  // Draw the plot
  this._draw_axis();
  this._draw_data();
};

plots.HorizontalBarChart.prototype = Object.create(plots.Plot.prototype);
plots.HorizontalBarChart.prototype.constructor = plots.HorizontalBarChart;

/// Draws the axis onto the canvas
plots.HorizontalBarChart.prototype._draw_axis = function() {
  this.context.save();
  var font_args = this.context.font.split(' ');
  this.context.font = this._settings.font_size + "px " + font_args[font_args.length - 1];
  this.context.strokeStyle = "Black";
  this.context.lineWidth = 2;
  // The vertical axis
  this.context.beginPath();
  this.context.moveTo(this._settings.vertical_axis_size, this._settings.horizontal_axis_size);
  this.context.lineTo(this._settings.vertical_axis_size, this._settings.height - this._settings.margin);
  this.context.stroke();
  this.context.closePath();
  for(var ibin = 0; ibin < this._data.length; ibin++) {
    var y = ibin * this._settings.bar_height + this._settings.bar_height / 2 + this._settings.horizontal_axis_size;
    this._fill_text(this._data[ibin].label, this._settings.vertical_axis_size - this._settings.margin, y, "right");
  }

  // The horizontal axis
  this.context.beginPath();
  this.context.moveTo(this._settings.vertical_axis_size,
                      this._settings.horizontal_axis_size);
  this.context.lineTo(this._settings.width,
                      this._settings.horizontal_axis_size);
  this.context.stroke();
  this.context.closePath();

  this._fill_text(this._settings.max_value,
                  this._settings.width - this._settings.margin,
                  this._settings.horizontal_axis_size - this._settings.margin, "right");
  this._fill_text("0",
                  this._settings.vertical_axis_size + this._settings.margin,
                  this._settings.horizontal_axis_size - this._settings.margin);
  if(this._settings.x_label)
    this._fill_text(this._settings.x_label, this._settings.horizontal_axis_size + (this._settings.width - this._settings.horizontal_axis_size) / 2,
                    this._settings.font_size, "center");
  this.context.restore();
};

/// Draws the data onto the canvas
plots.HorizontalBarChart.prototype._draw_data = function() {
  this.context.save();
  var max_bar_width = this._settings.width - this._settings.vertical_axis_size - this._settings.margin;
  for(var ibin = 0; ibin < this._data.length; ibin++) {
    var y = this._settings.margin + ibin * this._settings.bar_height + this._settings.horizontal_axis_size;

    this.context.fillStyle = this._settings.color;

    this.context.fillRect(this._settings.vertical_axis_size + this._settings.margin, y,
                          this._data[ibin].value * max_bar_width / this._settings.max_value,
                          this._settings.bar_height - 2 * this._settings.margin);
  }
  this.context.restore();
};
