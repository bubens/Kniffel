Array.prototype.max = function () {
	var i, l, x, t = 0;
	for (i = 0, l = this.length; i < l; i += 1) {
		x = this[i];
		if (!isNaN(x)) {
			if (x > t) {
				t = x;
			}
		}
	}
	return t;
};
