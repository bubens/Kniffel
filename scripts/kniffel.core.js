/* jshint strict:true */
/* global util */

kniffel.kniffel = (function ( kniffel, util, window ) {
	"use strict";
	// constants
	var IS_3_OF_A_KIND = 3,
	IS_4_OF_A_KIND = 4,
	IS_5_OF_A_KIND = 5,
	IS_FULL_HOUSE = "f",
	IS_SMALL_STRAIGHT = 4,
	IS_LARGE_STRAIGHT = 5,
	
	// flags
	is_activeReplay = false,
	is_entered = false,
	is_rolled = false,
	is_gameover = false,
	is_replay = false,
	is_undone = false,
	
	// rolls to go (element)
	togo = null,
	
	// make record
	record = (function () {
		var rcd = [];
		
		rcd.add = function ( move ) { rcd.push( move ); };
		rcd.undo = function () { rcd.pop(); };
		rcd.dump = function () { return rcd.join( "" ); };
		rcd.reset = function () { rcd = []; };
		
		return rcd;
	}()),
	
	// give the set of dice all the functions it requires
	dice = (function () {
		var dc = [];
		
		dc.click = function ( n ) {
			dc[ n ].hold();
		};
		
		dc.roll = function () {
			var i, l;
			if ( !is_activeReplay ) {
				if ( togo.decrement() ) {
					for ( i = 0, l = dc.length; i < l; i += 1 ) {
						dc[ i ].roll();
					}
				}
				else {
					kniffel.prompt.blink( "Alle Würfe geworfen." );
				}
				is_rolled = true;
				record.add( dc.getValue( true ) );
			}
		};
		
		dc.getValue = function ( str ) {
			var i, l, d, tmp;
			
			if ( !str ) {
				tmp = [];
				for ( i = 0, l = dc.length; i < l; i += 1 ) {
					tmp.push( dc[ i ].getValue() );
				}
			}
			else {
				tmp = "mvrx";
				for ( i = 0, l = dc.length; i < l; i += 1 ) {
					d = dc[ i ];
					tmp += d.getValue() + "";
					tmp += d.isHeld() ? "hx" : "x";
				}
			}
			return tmp;
		};
		
		dc.reset = function () {
			var i, l = dc.length;
			for ( i = 0; i < l; i += 1 ) {
				dc[ i ].reset();
			}
		};
		
		return dc;
	}()),
	
	// give the entries all the additional functions they require
	entries = (function ( kniffel, util, window ) {
		var entr = {};
		
		// enter value into upper half of sheet
		function upperHalf( id ) {
			var entry = window.parseInt( id.split( "_" )[ 1 ] ),
			x = core.functions.addUp( entry );
			entr[ id ].enter( x );
			sums.up.add( x );
			
			if ( !sums.bonus.given() ) {
				sums.bonus.add( x );
				if ( sums.bonus.given() ) {
					x += sums.bonus.getValue();
				}
			}
			return x;
		}
		
		// enter value into lower half of sheet
		function lowerHalf( id ) {
			var entry = id.split( "_" )[ 1 ], x;
			
			// sum it up if its of a kind (3 and 4) or of its "chance"
			if ( entry == "dp" && core.functions.isOfAKind( IS_3_OF_A_KIND ) ||	// on 3 of a kind OR
				entry == "vp" && core.functions.isOfAKind( IS_4_OF_A_KIND ) ||	// on 4 of a kind
				entry == "ch") { 												// on "chance"
					x = core.functions.addUp();
			}
			// make it 50 if its a yatzee
			else if ( entry == "kn" && core.functions.isOfAKind( IS_5_OF_A_KIND ) ) {
				x = 50;
			}
			// make it 25 if its a full house
			else if ( entry == "fh" && core.functions.isOfAKind( IS_FULL_HOUSE ) ) {
				x = 25;
			}
			// make it 30 if its a small straight
			else if ( entry == "ks" && core.functions.isStraight( IS_SMALL_STRAIGHT ) ) {
				x = 30;
			}
			// make it 40 if its a big/large straight
			else if ( entry == "gs" && core.functions.isStraight( IS_LARGE_STRAIGHT ) ) {
				x = 40;
			}
			// none if the above
			else {
				x = 0;
			}
			entr[ id ].enter( x );
			sums.down.add( x );
			
			return x;
		}
		
		entr.last = "";
		
		entr.enter = function ( id ) {
			var entry = id.split( "_" )[ 1 ],
			x = 0;
			
			if ( !is_rolled || is_gameover ) {
				return false;
			}
			
			if ( !is_entered && !entr[ id ].locked() ) {
				
				// if the id is not a string its an entry into the upper part
				// if it's a string it must be the lower part
				x = !window.isNaN( entry ) ? upperHalf( id ) : lowerHalf( id );
								
				sums.all.add( x );
				togo.zero();
				is_entered = true;
				is_undone = false;
				entr.last = entry;
				
				record.add( "mvex" + entry + "x" + x + "x" + sums.up.getValue() + "x" + sums.bonus.getValue() + "x" + sums.down.getValue() + "x" + sums.all.getValue() );
				
				if ( core.functions.isFilledOut() ) {
					is_gameover = true;
					if ( is_replay ) {
						replay.playRound();
					}
					else {
						gameOver();
					}
				}
			}
			else {
				kniffel.prompt.blink( "Wert bereits eingetragen!" );
			}
			
			return true;
		};
		
		entr.reset = function () {
			var prop;
			for ( prop in entr ) {
				if ( entr.hasOwnProperty( prop ) && entr[ prop ].reset ) {
					entr[ prop ].reset();
				}
			}
			return true;
		};
		
		return entr;
	}( kniffel, util, window )),
	
	// here come all the sums
	sums = {},
	
	// here is the replay function
	replay = (function ( kniffel, util, window ) {
		var rpl = {},
		round = null,
		rcd = "";
		
		function replayMove() {
			var t = /h/, r;
			
			// there are moves left
			if ( round.length > 0 ) {
				r = round.shift();
				// the move is a roll
				if ( r[ 0 ] == "r" ) {
					dice[ 0 ].rollTo( window.parseInt( r[ 1 ] ), t.test( r[ 1 ] ));
					dice[ 1 ].rollTo( window.parseInt( r[ 2 ] ), t.test( r[ 2 ] ));
					dice[ 2 ].rollTo( window.parseInt( r[ 3 ] ), t.test( r[ 3 ] ));
					dice[ 3 ].rollTo( window.parseInt( r[ 4 ] ), t.test( r[ 4 ] ));
					dice[ 4 ].rollTo( window.parseInt( r[ 5 ] ), t.test( r[ 5 ] ));
				}
				// the move is an entry
				else {
					rpl.entries[ r[ 1 ] ].set( r[ 2 ] );
					rpl.sums.bonus.set( window.parseInt( r[ 3 ] ) || "" );
					rpl.sums.up.set( window.parseInt( r[ 4 ] ) || "" );
					rpl.sums.down.set( window.parseInt( r[ 5 ] ) || "" );
					rpl.sums.all.set( window.parseInt( r[ 6 ] ) || "" );
				}
				window.setTimeout( replayMove, 500 );
			}
			else {
				dice.reset();
				is_activeReplay = false;
				if ( is_gameover ) {
					gameOver();
				}
			}
			return true;
		}
		
		rpl.name = "";
		
		rpl.sums = {};
		
		rpl.entries = (function () {
			var entr = {};
			entr.reset = function () {
				var prop;
				for ( prop in entr ) {
					if ( entr.hasOwnProperty( prop ) && entr[ prop ].reset ) {
						entr[ prop ].reset();
					}
				}
				return true;
			};
			return entr;
		}());
		
		// take the challenge object and prepare the replay
		rpl.init = function ( challenge ) {
			var i, j, k, l,
			tmp = challenge.game.split( "trn" );
			for ( i = 0, l = tmp.length; i < l; i += 1 ) {
				tmp[ i ] = tmp[ i ].split( "mv" );
				tmp[ i ].shift();
				for ( j = 0, k = tmp[i].length; j < k; j += 1 ) {
					tmp[ i ][ j ] = tmp[ i ][ j ].split( "x" );
				}
			}
			
			rpl.name = challenge.name;
			rcd = tmp;
			return true;
		};
		
		rpl.playRound = function () {
			is_activeReplay = true;
			if ( rcd.length > 0 ) {
				round = rcd.shift();
				replayMove();
			}
		};
		
		return rpl;
	}( kniffel, util, window )),
	
	highscore = (function ( kniffel, util, window ) {
		var hghscr = {},
		request = new XMLHttpRequest();
		
		function readyStateChange() {
			if ( request.readyState === 4 ) {
				if ( request.status === 200 ) {
					handleResponse();
				}
				else {
					kniffel.loader.hide();
				}
			}
		}
		
		function handleResponse() {
			var response = util.json.parse( request.responseText ),
			url = location.protocol + "//" + location.host + location.pathname + "?gid=",
			input = $( "gameid" );
			if ( response ) {
				if ( response.status === "success" ) {
					url += response.message;
					
					kniffel.prompt.show( "Spiel eingetragen!" );
					input.value = url;
					input.disabled = false;
					input.readonly = true;
					$( "againstme" ).href = url;
				}
				else {
					kniffel.blink( "Fehler bei Eintragung!" );
				}
			}
			kniffel.loader.hide();
			kniffel.list.reload();
		}
		
		hghscr.enter = function ( param ) {
			kniffel.loader.show();
			
			if ( request.readyState === 0 ) {
				request.open( "post", "list/enter.php", true );
				request.setRequestHeader( "X-Requested-With", "XMLHttpRequest" );
				request.setRequestHeader( "Content-Type", "application/x-www-form-urlencoded" );
				request.onreadystatechange = readyStateChange;
				request.send( param );
			}
			else {
				request.abort();
				hgscr.enter( param );
			}
			
			return true;
		};
		
		return hghscr;
	}( kniffel, util, window )),
	
	core = (function ( kniffel, util, window ) {
		var cr = {};
		
		cr.next = function () {
			if ( is_entered ) {
				dice.reset();
				togo.reset();
				is_entered = false;
				is_rolled = false;
				record.add( "trn" );
				if ( is_replay ) {
					replay.playRound();
				}
			}
			else {
				kniffel.prompt.blink( "Noch keinen Wert eingetragen!" );
			}
		};
		
		cr.undo = function () {
			var entry = entries.last;
			
			if ( !is_undone && is_entered && is_rolled && !is_gameover ) {
				entries[ "entry_" + entry ].reset();
				if ( !window.isNaN( entry ) ) {
					sums.up.undo();
					sums.bonus.undo();
				}
				else {
					sums.down.undo();
				}
				sums.all.undo();
				record.undo();
				is_entered = false;
				is_undone = true;
			}
		};
		
		cr.restart = function () {
			if ( window.confirm( "Neues Spiel starten?" ) ) {
				dice.reset();
				entries.reset();
				sums.up.reset();
				sums.bonus.reset();
				sums.down.reset();
				sums.all.reset();
				togo.reset();
				is_activeReplay = false;
				is_entered = false;
				is_rolled = false;
				is_gameover = false;
				record.reset();
				
				if ( is_replay ) {
					replay.init( kniffel.challenge );
					replay.entries.reset();
					replay.sums.up.reset();
					replay.sums.bonus.reset();
					replay.sums.down.reset();
					replay.sums.all.reset();
				}
			}
			return true;
		};
		
		cr.functions = {
			addUp: function ( v ) {
				var x = 0,
				dices = dice.getValue(),
				i, l = dices.length;
				
				for ( i = 0; i < l; i += 1 ) {
					x += v ? dices[ i ] === v ? v : 0 : dices[ i ];
				}
				return x;
			},
			
			isFilledOut: function () {
				var s = true, prop;
				
				for ( prop in entries ) {
					if ( entries.hasOwnProperty( prop ) ) {
						if ( entries[ prop ].locked ) {
							s = s && entries[ prop ].locked();
						}
					}
				}
				return s;
			},
			
			isOfAKind: function ( n ) {
				var d = dice.getValue(),
				i, j, l = d.length,
				t = 0,
				c = {"3" : 6, "4": 12, "5": 20, "f": 8};
				
				for ( i = 0; i < l; i += 1 ) {
					for ( j = 0; j < l; j += 1 ) {
						t += ( i !== j && d[ i ] === d[ j ] ) ? 1 : 0;
					}
				}
				return !window.isNaN( n ) ? t >= c[ n ] : t === c[ n ];
			},
			
			// too damn complicated
			isStraight: function ( n ) {
				var a = dice.getValue(),
				g = 0, q = 0,
				p = 0, i,
				l = a.length,
				r1, r2, r3, r4;
				
				a = a.sort( function ( a, b ) { return ( a === b ) ? 0 : ( a > b ) ? 1 : - 1; } );
				
				for ( i = 0; i < l; i += 1 ) {
					//count elements that are 1 greater than the previous!
					g += a[ i + 1 ] === a[ i ] + 1 ? 1 : 0;
					
					//count elements that equal the previous!
					q += a[ i + 1 ] === a[ i ] ? 1 : 0;
					
					//remember index of an element that is 2 smaller than next
					p += a[ i + 1 ] === a[ i ] + 2 ? i : 0;
				}
				
				//do we want at least 4 numbers in a row? (n>=4)
				//AND do we have 4 numbers that are 1 greater than the previous? (g==4)
				//(which makes 5 in a row)
				r1 = n >= 4 && g === 4;
				
				// OR:
				//do we want 4 numbers in a row? (n==4)
				//AND do we habe 4 numbers that are 1 greater than the previous? (g==3)
				r2 = n === 4 && g === 3;
				
				//problem: what about [1,2,3,5,6]? g would be 3 but it would be no straight.
				//to find out more about our list, we test for possible patterns.
				//we ask:
				//do we have a number that is two lesser than next on the
				//zeroth (p==0) OR third position (p==3)?
				//(only positions possible in a straight)
				r3 = p === 3 || p === 0;
				
				//OR:
				//do we have only one pair of equal numbers in our list? (q==1)
				//only one possible
				r4 = q === 1;
				
				
				//we combine and return our results:
				//in words:
				//we want at least and have exactly 5 in a row _OR_
				//we want 4 in a row and have 4 numbers that are one greater
				//than the previous _AND_
					//we assure that the only positions where the next number
					//is two greater is on zeroth or third position _OR_
					//that we only have one pair of equal numbers
				return r1 || ( r2 && ( r3 || r4 ) );
			}
		};
		
		return cr;
	}( kniffel, util, window ));				
					
	function gameOver() {
		var i = sums.all.getValue(),
		nm, y, win = "",
		cmt = kniffel.getComment( i ),
		txt = "", name, conf;
		
		function check( n ) {
			if ( n.length > 8 ) {
				return false;
			}
			return /^[\wäöu]+$/.test( n );
		}
		
		if ( is_replay ) {
			nm = replay.name;
			win = "Du hast das Spiel gegen " + nm;
			y = replay.sums.all.getValue();
			win += ( i > y ) ? "gewonnen.\n\n" : "verloren.\n\n";
		}
		
		txt += "Das Spiel ist vorbei. Du hast " + i + " Punkte erreicht.\n\n";
		txt += cmt + "\n\n" + win + "Spiel eintragen?";
		
		if ( window.confirm( txt ) ) {
			name = util.keks.get( "player" );
			name = window.prompt( "Name eingeben (max. 8 Zeichen):", name || "" );
			if ( name === "" ) {
				return false;
			}
			else if ( !check( name ) ) {
				while ( !check( name ) ) {
					name = window.prompt( "Name eingeben (max. 8 Zeichen):", name || "" );
				}
			}
			util.keks.set( "player", name, "30d" );
			highscore.enter( "n=" + name + "&p=" + i + "&r=" + record.dump() );
		}
		return true;
	}
	
	// do the initialisation:
	
	// know how many rolls to go in current turn
	togo = new kniffel.Togo( "togo" );
	
	// add dice to diceset
	dice.push( new kniffel.Dice( 80, "dice_cvs_0", "dice_cvs", "dice_0" ),
		new kniffel.Dice( 80, "dice_cvs_1", "dice_cvs", "dice_1" ),
		new kniffel.Dice( 80, "dice_cvs_2", "dice_cvs", "dice_2" ),
		new kniffel.Dice( 80, "dice_cvs_3", "dice_cvs", "dice_3" ),
		new kniffel.Dice( 80, "dice_cvs_4", "dice_cvs", "dice_4" ) );
	
	// make the entries
	entries.entry_1 = new kniffel.Entry( "entry_1" );
	entries.entry_2 = new kniffel.Entry( "entry_2" );
	entries.entry_3 = new kniffel.Entry( "entry_3" );
	entries.entry_4 = new kniffel.Entry( "entry_4" );
	entries.entry_5 = new kniffel.Entry( "entry_5" );
	entries.entry_6 = new kniffel.Entry( "entry_6" );
	entries.entry_dp = new kniffel.Entry( "entry_dp" );
	entries.entry_vp = new kniffel.Entry( "entry_vp" );
	entries.entry_fh = new kniffel.Entry( "entry_fh" );
	entries.entry_ks = new kniffel.Entry( "entry_ks" );
	entries.entry_gs = new kniffel.Entry( "entry_gs" );
	entries.entry_kn = new kniffel.Entry( "entry_kn" );
	entries.entry_ch = new kniffel.Entry( "entry_ch" );
	
	// make the sums
	sums.up = new kniffel.Sum( "sum_up" );
	sums.down = new kniffel.Sum( "sum_down" );
	sums.all = new kniffel.Sum( "sum_all" );
	sums.bonus = new kniffel.Bonus( "bonus" );
	
	// here comes the replay stuff
	if ( !!kniffel.challenge ) {
		is_replay = true;
		replay.init( kniffel.challenge );
	}
	
	if ( is_replay ) {
		replay.entries[ "1" ] = new kniffel.sEntry( "sentry_1" );
		replay.entries[ "2" ] = new kniffel.sEntry( "sentry_2" );
		replay.entries[ "3" ] = new kniffel.sEntry( "sentry_3" );
		replay.entries[ "4" ] = new kniffel.sEntry( "sentry_4" );
		replay.entries[ "5" ] = new kniffel.sEntry( "sentry_5" );
		replay.entries[ "6" ] = new kniffel.sEntry( "sentry_6" );
		replay.entries.dp = new kniffel.sEntry( "sentry_dp" );
		replay.entries.vp = new kniffel.sEntry( "sentry_vp" );
		replay.entries.fh = new kniffel.sEntry( "sentry_fh" );
		replay.entries.ks = new kniffel.sEntry( "sentry_ks" );
		replay.entries.gs = new kniffel.sEntry( "sentry_gs" );
		replay.entries.kn = new kniffel.sEntry( "sentry_kn" );
		replay.entries.ch = new kniffel.sEntry( "sentry_ch" );
		replay.sums.up = new kniffel.sEntry( "ssum_up" );
		replay.sums.down = new kniffel.sEntry( "ssum_down" );
		replay.sums.bonus = new kniffel.sEntry( "sbonus" );
		replay.sums.all = new kniffel.sEntry( "ssum_all" );
	}
	
	// and now the events we need!
	// hold/unhold dice
	util.event.add( $( "dice_0" ), "click", dice.click.curry( 0 ) );
	util.event.add( $( "dice_1" ), "click", dice.click.curry( 1 ) );
	util.event.add( $( "dice_2" ), "click", dice.click.curry( 2 ) );
	util.event.add( $( "dice_3" ), "click", dice.click.curry( 3 ) );
	util.event.add( $( "dice_4" ), "click", dice.click.curry( 4 ) );
	
	// game controls
	util.event.add( $( "roll" ), "click", dice.roll );
	util.event.add( $( "turn" ), "click", core.next );
	util.event.add( $( "undo" ), "click", core.undo );
	util.event.add( $( "restart" ), "click", core.restart );
	
	// finally the forms/entries
	util.event.add( $( "entry_1" ), "click", entries.enter.curry( "entry_1" ) );
	util.event.add( $( "entry_2" ), "click", entries.enter.curry( "entry_2" ) );
	util.event.add( $( "entry_3" ), "click", entries.enter.curry( "entry_3" ) );
	util.event.add( $( "entry_4" ), "click", entries.enter.curry( "entry_4" ) );
	util.event.add( $( "entry_5" ), "click", entries.enter.curry( "entry_5" ) );
	util.event.add( $( "entry_6" ), "click", entries.enter.curry( "entry_6" ) );
	util.event.add( $( "entry_dp" ), "click", entries.enter.curry( "entry_dp" ) );
	util.event.add( $( "entry_vp" ), "click", entries.enter.curry( "entry_vp" ) );
	util.event.add( $( "entry_fh" ), "click", entries.enter.curry( "entry_fh" ) );
	util.event.add( $( "entry_ks" ), "click", entries.enter.curry( "entry_ks" ) );
	util.event.add( $( "entry_gs" ), "click", entries.enter.curry( "entry_gs" ) );
	util.event.add( $( "entry_kn" ), "click", entries.enter.curry( "entry_kn" ) );
	util.event.add( $( "entry_ch" ), "click", entries.enter.curry( "entry_ch" ) );
		
	return core;
}( kniffel, util, window ));
