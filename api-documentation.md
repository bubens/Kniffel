# Highscore-List API

The highscore-list at `list/index.php` has an API to retrieve highscore entries with different filters an in a set of formats. To use the API just request `list/index.php` with the here described query-pairs.

## 1. get=[value]

Filter for a specific set of entries:

`get=[all|month=[MMYY]|name=[$NAME]|days=[X]|last=[X]]`:

### 1.1 Possible queries:

* **`all`**: all entries (Usage: `list/index.php?get=all`)
* **`month=[mmyy]`**: all entries from specified month (Usage: `list/index.php?get=month=0314`)
* **`name=[$username]`**: entries by $username (Usage: `list/index.php?get=name=bubens`)
* **`days=[$x]`**: all entries from the last X days (Usage: `list/index.php?get=last=10`)
* **`last=[$x]`**: last X entries (Usage: `list/index.php?get=last=10`)

### 1.2 DEFAULT
`get=month=[current month][current year]`

### 1.3 EXAMPLE

Request all entries from march of 2011:
[http://unpunk.de/kniffel/list/index.php?get=month=0311]()

### 1.4 ATTENTION
if best-query isn't set to 'f' (false) the list of entries will only contain the top entries per username. see "best"-param for all entries.

## 2. best=[value]

Filter the results from `get` for the top result per username.

### 2.1 Possible queries

* **`t`** *(for true)*: only the best highscores per username (Usage: `list/index.php?best=t`)
* **`f`** *(for false)*: all highscores per username (Usage: `list/index.php?best=f`)

### 2.2 DEFAULT: 

`best=t`

### 2.3 EXAMPLE: 

Get all entries per username:
[http://unpunk.de/kniffel/list/index.php?best=f]()

## 3. top=[value]

Cut set from `get` and `best` after a given number of entries.

### 3.1 Possible queries

* **all**: do not cut set. (Usage: `list/index.php?top=all`)
* **[$x]**: cut after $%x entries. (Usage: `list/index.php?top=10`)

	
### 3.2 DEFAULT

`top=all`

### 3.3. EXAMPLE

Show top 3 results from default set:
[http://unpunk.de/kniffel/list/index.php?top=3]()

## 4. ordered=[value]

Return the results ordered by points or date.

### 4.1 Possible queries

* **t** *(for true)*: ordered by points (Usage: `list/index.php?ordered=t`)
* **f** *(for false)*: ordered by date (Usage: `list/index.php?ordered=f`)

### 4.2 DEFAULT

`ordered=t`

### 4.3 EXAMPLE

Show default selection ordered by date:
[http://unpunk.de/kniffel/list/index.php?ordered=f]()

## 5. format=[value]

Return the result of the filters in specified format.

### 5.1 Possible queries

* **html**: send in html-format (Usage: `list/index.php/?format=html`)
* **text**: send in text-format (Usage: `list/index.php/?format=text`)
* **xml**: send in text-format (Usage: `list/index.php/?format=xml`)
* **csv**: send in comma-seperated-value-format (Usage: `list/index.php/?format=csv`)
* **json**: send in json-format (Usage: `list/index.php/?format=json`)

### 5.2 DEFAULT

`format=html`

### 5.3 EXAMPLE

Send default selection in text-format:
[http://unpunk.de/kniffel/list/index.php?format=text]()

## 6. record=[value]

### 6.1 Possible queries

* **t** *(for true)*: send a record of the game with every entry (Usage: `list/index.php/?record=t`)
* **f** *(for false)*: send entry-data only (Usage: `list/index.php/?record=f`)

### 6.2 DEFAULT

`record=f`

### 6.3 EXAMPLE

Send default selection as json without record:
[http://unpunk.de/kniffel/list/index.php?format=json&record=f]()

### 6.2 ATTENTION

Applies only to requests with format=json

## 7. compress=[value]

Should the response be send gz-compressed.

### 7.1 Possible queries

* **t** *(for true)*: send data gz-compressed
* **f** *(for false)*: send data uncompressed

### 7.2 DEFAULT

`compress=t`

### 7.3 EXAMPLE

Send an uncompressed CSV.
[http://unpunk.de/kniffel/list/index.php?get=all&format=csv&compress=f]()

## 8.Examples

### 8.1 EXAMPLE 1

Request the all-time top10 entries by user *bubens* as compressed text:

[http://unpunk.de/kniffel/list/index.php?get=name=bubens&best=f&top=10&format=text&compress=t]()

### 8.2 EXAMPLE 2

Request the last 10 entries ordered by data in an uncompressed json-format:

[http://unpunk.de/kniffel/list/index.php?get=last=10&best=f&format=json&ordered=f&compress=f]()

