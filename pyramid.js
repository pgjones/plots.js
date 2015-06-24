var plots = plots || {};


/// Produce a pyramid plot on a canvas DOM element.
///
/// Args:
///  data: A list of groups in the following format (example values)
///        [{'group': '0-20', 'male': 20, 'female': 10}]
///  options: Associate array of optional settings, including:
///    width: Optional plot width, defaults to 300px
///    height: Optional plot height, defaults to 400px
plots.Pyramid = function(data, options) {
  options = options || {};
  this._settings = {
    width: options.width || 400,
    height: options.height || 300,
    axis_size: options.axis_size || 20,
    male_color: options.male_color || "darkblue",
    female_color: options.female_color || "magenta",
    margin: options.margin || 2,
    axis_thickness: options.axis_thickness || 2,
  };
  this._data = data;
  // Calculate extra settings
  var max_value = 1;
  var longest_label = 1;
  for(var igroup = 0; igroup < this._data.length; igroup++) {
    max_value = Math.max(max_value, Math.max(this._data[igroup].male, this._data[igroup].female));
    longest_label = Math.max(longest_label, this._data[igroup].group.length);
  }
  this._settings.max_value = max_value;
  this._settings.label_width = this._settings.axis_size * longest_label / 2;
  this._settings.bar_height = (this._settings.height - 2 * this._settings.axis_size) / this._data.length;
  // Create the canvas and draw the plot
  this.canvas = document.createElement("canvas");
  this.canvas.width = this._settings.width;
  this.canvas.height = this._settings.height;
  this.context = this.canvas.getContext("2d");
  this._draw_axis();
  this._draw_data();
};


/// Draws the axis onto the canvas
plots.Pyramid.prototype._draw_axis = function() {
  this.context.save();
  var font_args = this.context.font.split(' ');
  this.context.font = this._settings.axis_size + "px " + font_args[font_args.length - 1];
  this.context.strokeStyle = "Black";
  this.context.lineWidth = 2;
  // The vertical axis
  this.context.beginPath();
  this.context.moveTo((this._settings.width - this._settings.label_width) / 2 - this._settings.margin,
                      this._settings.axis_size);
  this.context.lineTo((this._settings.width - this._settings.label_width) / 2 - this._settings.margin,
                      this._settings.height - this._settings.axis_size);
  this.context.moveTo((this._settings.width + this._settings.label_width) / 2 + this._settings.margin,
                      this._settings.axis_size);
  this.context.lineTo((this._settings.width + this._settings.label_width) / 2 + this._settings.margin,
                      this._settings.height - this._settings.axis_size);
  this.context.stroke();
  this.context.closePath();

  for(var igroup = 0; igroup < this._data.length; igroup++) {
    var y = this._settings.height - this._settings.axis_size - igroup * this._settings.bar_height - this._settings.bar_height / 2;
    this.context.fillText(this._data[igroup].group, (this._settings.width - this._settings.label_width) / 2, y);
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
  this.context.fillText(this._settings.max_value, this._settings.margin,
                        this._settings.height - this._settings.margin);
  this.context.fillText("0", (this._settings.width - this._settings.label_width - this._settings.axis_size) / 2,
                        this._settings.height - this._settings.margin);
  this.context.fillText("0", (this._settings.width + this._settings.label_width) / 2,
                        this._settings.height - this._settings.margin);
  this.context.fillText(this._settings.max_value, this._settings.width - this._settings.max_value.toString().length * this._settings.axis_size / 2 - this._settings.margin,
                        this._settings.height - this._settings.margin);

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
