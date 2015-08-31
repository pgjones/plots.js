var plots = plots || {};


/// Produce a pyramid plot on a canvas DOM element.
///
/// Args:
///  data: A list of groups in the following format (example values)
///        [{'group': '0-20', 'male': 20, 'female': 10}]
///  options: Associate array of optional settings, including:
///    width: Plot width, defaults to 300px
///    height: Plot height, defaults to 400px
///    margin: Margin between any part of the plot and the edge, and within the plot
plots.Pyramid = function(data, options, canvas) {
  plots.Plot.call(this, options, canvas);
  options = options || {};
  this._settings.male_color = options.male_color || "darkblue";
  this._settings.female_color = options.female_color || "magenta";
  this._data = data;
  // Calculate extra settings
  var max_value = 1;
  var longest_label = 1;
  for(var igroup = 0; igroup < this._data.length; igroup++) {
    max_value = Math.max(max_value, Math.max(this._data[igroup].male, this._data[igroup].female));
    longest_label = Math.max(longest_label, this._data[igroup].group.length);
  }
  this._settings.axis_size = this._settings.font_size * 2.0;
  this._settings.max_value = max_value;
  this._settings.label_width = this._settings.axis_size * longest_label / 2;
  this._settings.bar_height = (this._settings.height - this._settings.axis_size) / this._data.length;

  this._draw_axis();
  this._draw_data();
};

plots.Pyramid.prototype = Object.create(plots.Plot.prototype);
plots.Pyramid.prototype.constructor = plots.Pyramid;

/// Draws the axis onto the canvas
plots.Pyramid.prototype._draw_axis = function() {
  this.context.save();
  var font_args = this.context.font.split(' ');
  this.context.font = this._settings.font_size + "px " + font_args[font_args.length - 1];
  this.context.strokeStyle = "Black";
  this.context.lineWidth = 2;
  // The vertical axis
  this.context.beginPath();
  this.context.moveTo((this._settings.width - this._settings.label_width) / 2 - this._settings.margin,
                      this._settings.margin);
  this.context.lineTo((this._settings.width - this._settings.label_width) / 2 - this._settings.margin,
                      this._settings.height - this._settings.axis_size);
  this.context.moveTo((this._settings.width + this._settings.label_width) / 2 + this._settings.margin,
                      this._settings.margin);
  this.context.lineTo((this._settings.width + this._settings.label_width) / 2 + this._settings.margin,
                      this._settings.height - this._settings.axis_size);
  this.context.stroke();
  this.context.closePath();

  for(var igroup = 0; igroup < this._data.length; igroup++) {
    var y = this._settings.height - this._settings.axis_size - igroup * this._settings.bar_height - this._settings.bar_height / 2;
    this._fill_text(this._data[igroup].group, this._settings.width / 2, y, "center");
  }

  // The horizontal axis
  this.context.beginPath();
  this.context.moveTo(this._settings.margin, this._settings.height - this._settings.axis_size);
  this.context.lineTo((this._settings.width - this._settings.label_width) / 2 - this._settings.margin,
                      this._settings.height - this._settings.axis_size);

  this.context.moveTo((this._settings.width + this._settings.label_width) / 2 + this._settings.margin,
                      this._settings.height - this._settings.axis_size);
  this.context.lineTo(this._settings.width - this._settings.margin, this._settings.height - this._settings.axis_size);
  this.context.stroke();
  this.context.closePath();
  this._fill_text(this._settings.max_value, this._settings.margin,
                  this._settings.height - this._settings.axis_size + this._settings.font_size);
  this._fill_text("0", (this._settings.width - this._settings.label_width) / 2,
                  this._settings.height - this._settings.axis_size + this._settings.font_size, "right");
  this._fill_text("0", (this._settings.width + this._settings.label_width) / 2,
                  this._settings.height - this._settings.axis_size + this._settings.font_size);
  this._fill_text(this._settings.max_value, this._settings.width - this._settings.margin,
                  this._settings.height - this._settings.axis_size + this._settings.font_size, "right");
  this.context.restore();
};

/// Draws the data onto the canvas
plots.Pyramid.prototype._draw_data = function() {
  this.context.save();
  var max_bar_width = (this._settings.width - this._settings.label_width) / 2 - this._settings.margin;
  for(var igroup = 0; igroup < this._data.length; igroup++) {
    var male_width = this._data[igroup].male / this._settings.max_value * max_bar_width;
    var female_width = this._data[igroup].female / this._settings.max_value * max_bar_width;
    var y = this._settings.height - this._settings.axis_size - (igroup + 1) * this._settings.bar_height + this._settings.margin;

    this.context.fillStyle = this._settings.male_color;
    this.context.fillRect(max_bar_width - male_width - this._settings.margin, y,
                          male_width, this._settings.bar_height - 2 * this._settings.margin);
    this.context.fillStyle = this._settings.female_color;
    this.context.fillRect(this._settings.width - max_bar_width + this._settings.margin, y,
                          female_width, this._settings.bar_height - 2 * this._settings.margin);
  }
  this.context.restore();
};
