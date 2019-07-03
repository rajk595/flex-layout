var gulp = require('gulp');
var ui5preload = require('gulp-ui5-preload');
var uglify = require('gulp-uglify');
var prettydata = require('gulp-pretty-data');
var gulpif = require('gulp-if');
var gulpmatch = require('gulp-match');



//*****Version 3.00
var conditions = function(file)
{
	
	var exclude = gulpmatch(file, [ 'inGrid.js']);
	var include = gulpmatch(file, [ '*.js' ]);	
	var res = include && !exclude;
	
	
	console.error(file.path + ': Result = ' + res);
	
	return res;
} 

	gulp.task(
	    'igrid-3.00',
	    function () {

	        return gulp.src([	  
	                    'WebContent/3.00/vistex/ui/widgets/IGrid/**/**.+(js|xml)',    
	                    '!WebContent/3.00/vistex/ui/widgets/IGrid/inGrid.js',
	                    '!WebContent/3.00/vistex/ui/widgets/IGrid/library-preload.js',
	                    '!WebContent/WEB-INF/web.xml',
	                    '!node_modules/**',
	                    '!WebContent/model/metadata.xml',
	                    '!WebContent/resources/**',
	                ]
	            ) 
	.pipe(gulpif(conditions, uglify()))
	            .on('error', function (err) {
	                console.error('Error in compress task', err.toString());
	            })
	            .pipe(gulpif('**/*.xml', prettydata({ type: 'minify' })))
	            .pipe(ui5preload({
	                base: './WebContent/3.00',
	                namespace: '',
	                fileName: 'library-preload.js'
	            }))
	            .pipe(gulp.dest('./WebContent/3.00/vistex/ui/widgets/IGrid'));
	    }
	) 
	 
var controls = function(file)
{
    var include = gulpmatch(file, [ '*.js', '**/*.js']);
    
    var res = include;
    console.error(file.path + ': Result = ' + res);
    
    return res;
}

gulp.task(
    'controls-3.00',
    function () {

        return gulp.src([
                    //'**/**.+(js|xml|properties)',
                    'WebContent/3.00/vistex/ui/controls/**/**.+(js|xml)',
                    '!WebContent/3.00/vistex/ui/controls/library-preload.js',
                    '!WebContent/WEB-INF/web.xml',
                    '!node_modules/**',
                    '!WebContent/model/metadata.xml',
                    '!WebContent/resources/**',
                ]
            )

           .pipe(gulpif(controls, uglify()))
            .on('error', function (err) {
                console.error('Error in compress task', err.toString());
            })
            .pipe(gulpif('**/*.xml', prettydata({ type: 'minify' })))
            .pipe(ui5preload({
                base: './WebContent/3.00',
                namespace: '',
                fileName: 'library-preload.js'
            }))
            .pipe(gulp.dest('./WebContent/3.00/vistex/ui/controls'));
    }
)

var core = function(file)
{    
    //var exclude = gulpmatch(file, [ '*/plugins/*.js']);
    var exclude = gulpmatch(file, [ 'excelplus-2.5.min.js' ,'xlsx.core.min.js', 'underscore-min.js']);
    var include = gulpmatch(file, [ '*.js' ]);
    
    var res = include && !exclude;       
    console.error(file.path + ': Result = ' + res);
    
    return res;
}


gulp.task(
    'core-3.00',
    function () {

        return gulp.src([
                    //'**/**.+(js|xml|properties)',
                    'WebContent/3.00/vistex/ui/core/**/**.+(js|xml)',
                    '!WebContent/3.00/vistex/ui/core/library-preload.js',
                    '!WebContent/WEB-INF/web.xml',
                    '!node_modules/**',
                    '!WebContent/model/metadata.xml',
                    '!WebContent/resources/**',
                ]
            )

            .pipe(gulpif(core, uglify()))
            .on('error', function (err) {
                console.error('Error in compress task', err.toString());
            })
            .pipe(gulpif('**/*.xml', prettydata({ type: 'minify' })))
            .pipe(ui5preload({
                base: './WebContent/3.00',
                namespace: '',
                fileName: 'library-preload.js'
            }))
            .pipe(gulp.dest('./WebContent/3.00/vistex/ui/core'));
    }
)

var dashboard = function(file)
{    
    var exclude = gulpmatch(file, [ 'vizi.js', 'dashboard.bundle.js']);    
    var include = gulpmatch(file, [ '*.js' ]);
       
    var res = include && !exclude;
    
    console.error(file.path + ': Result = ' + res);    
    return res;
}

gulp.task(
    'dashboard-3.00',
    function () {

        return gulp.src([
                    //'**/**.+(js|xml|properties)',
                    'WebContent/3.00/vistex/ui/widgets/Dashboard/**/**.+(js|xml)',
                    '!WebContent/3.00/vistex/ui/widgets/Dashboard/library-preload.js',
                    '!WebContent/WEB-INF/web.xml',
                    '!node_modules/**',
                    '!WebContent/model/metadata.xml',
                    '!WebContent/resources/**',
                ]
            )

            .pipe(gulpif(dashboard, uglify()))
            .on('error', function (err) {
                console.error('Error in compress task', err.toString());
            })
            .pipe(gulpif('**/*.xml', prettydata({ type: 'minify' })))
            .pipe(ui5preload({
                base: './WebContent/3.00',
                namespace: '',
                fileName: 'library-preload.js'
            }))
            .pipe(gulp.dest('./WebContent/3.00/vistex/ui/widgets/Dashboard'));
    }
)
var synopsis = function(file)
{    
    var exclude = gulpmatch(file, [ 'synopsis.bundle.min.js', "synopsis.native.css.js"]);   
    var include = gulpmatch(file, [ '*.js' ]);
        
    var res = include && !exclude;
    
    console.error(file.path + ': Result = ' + res);    
    return res;
}

gulp.task(
    'synopsis-3.00',
    function () {

        return gulp.src([
                    //'**/**.+(js|xml|properties)',
                    'WebContent/3.00/vistex/ui/widgets/Synopsis/**/**.+(js|xml)',
                    '!WebContent/3.00/vistex/ui/widgets/Synopsis/library-preload.js',
                    '!WebContent/WEB-INF/web.xml',
                    '!node_modules/**',
                    '!WebContent/model/metadata.xml',
                    '!WebContent/resources/**',
                ]
            )

            .pipe(gulpif(dashboard, uglify()))
            .on('error', function (err) {
                console.error('Error in compress task', err.toString());
            })
            .pipe(gulpif('**/*.xml', prettydata({ type: 'minify' })))
            .pipe(ui5preload({
                base: './WebContent/3.00',
                namespace: '',
                fileName: 'library-preload.js'
            }))
            .pipe(gulp.dest('./WebContent/3.00/vistex/ui/widgets/Synopsis'));
    }
)

var vcharts = function(file)
{    
    var exclude = gulpmatch(file, [ 'vcharts.js']);    
    var include = gulpmatch(file, [ '*.js' ]);
        
    var res = include && !exclude;    
    console.error(file.path + ': Result = ' + res);
    
    return res;
}

gulp.task(
    'vcharts-3.00',
    function () {

        return gulp.src([
                    //'**/**.+(js|xml|properties)',
                    'WebContent/3.00/vistex/ui/widgets/Vcharts/**/**.+(js|xml)',
                    '!WebContent/3.00/vistex/ui/widgets/Vcharts/library-preload.js',
                    '!WebContent/WEB-INF/web.xml',
                    '!node_modules/**',
                    '!WebContent/model/metadata.xml',
                    '!WebContent/resources/**',
                ]
            )

            .pipe(gulpif(vcharts, uglify()))
            .on('error', function (err) {
                console.error('Error in compress task', err.toString());
            })
            .pipe(gulpif('**/*.xml', prettydata({ type: 'minify' })))
            .pipe(ui5preload({
                base: './WebContent/3.00',
                namespace: '',
                fileName: 'library-preload.js'
            }))
            .pipe(gulp.dest('./WebContent/3.00/vistex/ui/widgets/Vcharts'));
    }
)


var heatmap = function(file)
{        
    var include = gulpmatch(file, [ '*.js' ]);       
    var res = include;
    
    console.error(file.path + ': Result = ' + res);    
    return res;
}

gulp.task(
    'heatmap-3.00',
    function () {

        return gulp.src([
                    //'**/**.+(js|xml|properties)',
                    'WebContent/3.00/vistex/ui/availsWidgets/HeatMap/**/**.+(js|xml)',
                    '!WebContent/3.00/vistex/ui/availsWidgets/HeatMap/library-preload.js',
                    '!WebContent/WEB-INF/web.xml',
                    '!node_modules/**',
                    '!WebContent/model/metadata.xml',
                    '!WebContent/resources/**',
                ]
            )

            .pipe(gulpif(heatmap, uglify()))
            .on('error', function (err) {
                console.error('Error in compress task', err.toString());
            })
            .pipe(gulpif('**/*.xml', prettydata({ type: 'minify' })))
            .pipe(ui5preload({
                base: './WebContent/3.00',
                namespace: '',
                fileName: 'library-preload.js'
            }))
            .pipe(gulp.dest('./WebContent/3.00/vistex/ui/availsWidgets/HeatMap'));
    }
)

var hierarchytree = function(file)
{        
    var include = gulpmatch(file, [ '*.js' ]);      
    var res = include;
    
    console.error(file.path + ': Result = ' + res);    
    return res;
}

gulp.task(
    'hierarchytree-3.00',
    function () {

        return gulp.src([
                    //'**/**.+(js|xml|properties)',
                    'WebContent/3.00/vistex/ui/availsWidgets/HierarchyTree/**/**.+(js|xml)',
                    '!WebContent/3.00/vistex/ui/availsWidgets/HierarchyTree/library-preload.js',
                    '!WebContent/WEB-INF/web.xml',
                    '!node_modules/**',
                    '!WebContent/model/metadata.xml',
                    '!WebContent/resources/**',
                ]
            )

            .pipe(gulpif(hierarchytree, uglify()))
            .on('error', function (err) {
                console.error('Error in compress task', err.toString());
            })
            .pipe(gulpif('**/*.xml', prettydata({ type: 'minify' })))
            .pipe(ui5preload({
                base: './WebContent/3.00',
                namespace: '',
                fileName: 'library-preload.js'
            }))
            .pipe(gulp.dest('./WebContent/3.00/vistex/ui/availsWidgets/HierarchyTree'));
    }
)

var availsHeader = function(file)
{        
    var include = gulpmatch(file, [ '*.js' ]);      
    var res = include;
    
    console.error(file.path + ': Result = ' + res);    
    return res;
}

gulp.task(
    'availsHeader-3.00',
    function () {

        return gulp.src([
                    //'**/**.+(js|xml|properties)',
                    'WebContent/3.00/vistex/ui/availsWidgets/AvailsHeader/**/**.+(js|xml)',
                    '!WebContent/3.00/vistex/ui/availsWidgets/AvailsHeader/library-preload.js',
                    '!WebContent/WEB-INF/web.xml',
                    '!node_modules/**',
                    '!WebContent/model/metadata.xml',
                    '!WebContent/resources/**',
                ]
            )

            .pipe(gulpif(hierarchytree, uglify()))
            .on('error', function (err) {
                console.error('Error in compress task', err.toString());
            })
            .pipe(gulpif('**/*.xml', prettydata({ type: 'minify' })))
            .pipe(ui5preload({
                base: './WebContent/3.00',
                namespace: '',
                fileName: 'library-preload.js'
            }))
            .pipe(gulp.dest('./WebContent/3.00/vistex/ui/availsWidgets/AvailsHeader'));
    }
)

var designerRegex = function(file)
{	
	var exclude = gulpmatch(file, [ '*/StatementEditor/*.js']);
	var exclude1 = gulpmatch(file, [ 'Designer_library.js']);
	var include = gulpmatch(file, [ '*.js' ]);
	var res = include && !exclude && !exclude1;
	console.error(file.path + ': Result = ' + res);
	return res;
}

gulp.task(
    'Designer-3.00',
    function () {

        return gulp.src([
                    'WebContent/3.00/vistex/ui/widgets/Designer/**/**.+(js|xml|properties)',
                    '!WebContent/3.00/vistex/ui/widgets/Designer/library-preload.js',
                    '!WebContent/WEB-INF/web.xml',
                    '!node_modules/**',
                    '!WebContent/model/metadata.xml',
                    '!WebContent/resources/**',
                ]
            )

            .pipe(gulpif(designerRegex, uglify()))
            .on('error', function (err) {
                console.error('Error in compress task', err.toString());
            })
            .pipe(gulpif('**/*.xml', prettydata({ type: 'minify' })))
            .pipe(ui5preload({
                base: './WebContent/3.00',
                namespace: '',
                fileName: 'library-preload.js'
            }))
            .pipe(gulp.dest('./WebContent/3.00/vistex/ui/widgets/Designer'));
    }
)

//*****
var conditions = function(file)
{
	
	var exclude = gulpmatch(file, [ 'inGrid.js']);
	var include = gulpmatch(file, [ '*.js' ]);	
	var res = include && !exclude;
	
	
	console.error(file.path + ': Result = ' + res);
	
	return res;
} 

	gulp.task(
	    'igrid-2.00',
	    function () {

	        return gulp.src([	  
	                    'WebContent/2.00/vistex/ui/widgets/IGrid/**/**.+(js|xml)',                  
	                    '!WebContent/2.00/vistex/ui/widgets/IGrid/library-preload.js',
	                    '!WebContent/WEB-INF/web.xml',
	                    '!node_modules/**',
	                    '!WebContent/model/metadata.xml',
	                    '!WebContent/resources/**',
	                ]
	            ) 
	.pipe(gulpif(conditions, uglify()))
	            .on('error', function (err) {
	                console.error('Error in compress task', err.toString());
	            })
	            .pipe(gulpif('**/*.xml', prettydata({ type: 'minify' })))
	            .pipe(ui5preload({
	                base: './WebContent/2.00',
	                namespace: '',
	                fileName: 'library-preload.js'
	            }))
	            .pipe(gulp.dest('./WebContent/2.00/vistex/ui/widgets/IGrid'));
	    }
	) 
var controls = function(file)
{
    var include = gulpmatch(file, [ '*.js', '**/*.js']);
    
    var res = include;
    console.error(file.path + ': Result = ' + res);
    
    return res;
}


gulp.task(
    'controls-2.00',
    function () {

        return gulp.src([
                    //'**/**.+(js|xml|properties)',
                    'WebContent/2.00/vistex/ui/controls/**/**.+(js|xml)',
                    '!WebContent/2.00/vistex/ui/controls/library-preload.js',
                    '!WebContent/WEB-INF/web.xml',
                    '!node_modules/**',
                    '!WebContent/model/metadata.xml',
                    '!WebContent/resources/**',
                ]
            )

           .pipe(gulpif(controls, uglify()))
            .on('error', function (err) {
                console.error('Error in compress task', err.toString());
            })
            .pipe(gulpif('**/*.xml', prettydata({ type: 'minify' })))
            .pipe(ui5preload({
                base: './WebContent/2.00',
                namespace: '',
                fileName: 'library-preload.js'
            }))
            .pipe(gulp.dest('./WebContent/2.00/vistex/ui/controls'));
    }
)

var core = function(file)
{
    
    //var exclude = gulpmatch(file, [ '*/plugins/*.js']);
   var exclude = gulpmatch(file, [ 'excelplus-2.5.min.js' ,'xlsx.core.min.js', 'underscore-min.js']);
    var include = gulpmatch(file, [ '*.js' ]);
    
    var res = include && !exclude;
    
    
    console.error(file.path + ': Result = ' + res);
    
    return res;
}



gulp.task(
    'core-2.00',
    function () {

        return gulp.src([
                    //'**/**.+(js|xml|properties)',
                    'WebContent/2.00/vistex/ui/core/**/**.+(js|xml)',
                    '!WebContent/2.00/vistex/ui/core/library-preload.js',
                    '!WebContent/WEB-INF/web.xml',
                    '!node_modules/**',
                    '!WebContent/model/metadata.xml',
                    '!WebContent/resources/**',
                ]
            )

            .pipe(gulpif(core, uglify()))
            .on('error', function (err) {
                console.error('Error in compress task', err.toString());
            })
            .pipe(gulpif('**/*.xml', prettydata({ type: 'minify' })))
            .pipe(ui5preload({
                base: './WebContent/2.00',
                namespace: '',
                fileName: 'library-preload.js'
            }))
            .pipe(gulp.dest('./WebContent/2.00/vistex/ui/core'));
    }
)

var dashboard = function(file)
{
    
    var exclude = gulpmatch(file, [ 'vizi.js', 'dashboard.bundle.js']);
    
    var include = gulpmatch(file, [ '*.js' ]);
    
    
    var res = include && !exclude;
    

    console.error(file.path + ': Result = ' + res);
    
    return res;
}

gulp.task(
    'dashboard-2.00',
    function () {

        return gulp.src([
                    //'**/**.+(js|xml|properties)',
                    'WebContent/2.00/vistex/ui/widgets/Dashboard/**/**.+(js|xml)',
                    '!WebContent/2.00/vistex/ui/widgets/Dashboard/library-preload.js',
                    '!WebContent/WEB-INF/web.xml',
                    '!node_modules/**',
                    '!WebContent/model/metadata.xml',
                    '!WebContent/resources/**',
                ]
            )

            .pipe(gulpif(dashboard, uglify()))
            .on('error', function (err) {
                console.error('Error in compress task', err.toString());
            })
            .pipe(gulpif('**/*.xml', prettydata({ type: 'minify' })))
            .pipe(ui5preload({
                base: './WebContent/2.00',
                namespace: '',
                fileName: 'library-preload.js'
            }))
            .pipe(gulp.dest('./WebContent/2.00/vistex/ui/widgets/Dashboard'));
    }
)
var synopsis = function(file)
{
    
    var exclude = gulpmatch(file, [ 'synopsis.bundle.min.js', "synopsis.native.css.js"]);
    
    var include = gulpmatch(file, [ '*.js' ]);
    
    
    var res = include && !exclude;
    

    console.error(file.path + ': Result = ' + res);
    
    return res;
}

gulp.task(
    'synopsis-2.00',
    function () {

        return gulp.src([
                    //'**/**.+(js|xml|properties)',
                    'WebContent/2.00/vistex/ui/widgets/Synopsis/**/**.+(js|xml)',
                    '!WebContent/2.00/vistex/ui/widgets/Synopsis/library-preload.js',
                    '!WebContent/WEB-INF/web.xml',
                    '!node_modules/**',
                    '!WebContent/model/metadata.xml',
                    '!WebContent/resources/**',
                ]
            )

            .pipe(gulpif(dashboard, uglify()))
            .on('error', function (err) {
                console.error('Error in compress task', err.toString());
            })
            .pipe(gulpif('**/*.xml', prettydata({ type: 'minify' })))
            .pipe(ui5preload({
                base: './WebContent/2.00',
                namespace: '',
                fileName: 'library-preload.js'
            }))
            .pipe(gulp.dest('./WebContent/2.00/vistex/ui/widgets/Synopsis'));
    }
)

var vcharts = function(file)
{
    
    var exclude = gulpmatch(file, [ 'vcharts.js']);
    
    var include = gulpmatch(file, [ '*.js' ]);
    
    
    var res = include && !exclude;
    

    console.error(file.path + ': Result = ' + res);
    
    return res;
}

gulp.task(
    'vcharts-2.00',
    function () {

        return gulp.src([
                    //'**/**.+(js|xml|properties)',
                    'WebContent/2.00/vistex/ui/widgets/Vcharts/**/**.+(js|xml)',
                    '!WebContent/2.00/vistex/ui/widgets/Vcharts/library-preload.js',
                    '!WebContent/WEB-INF/web.xml',
                    '!node_modules/**',
                    '!WebContent/model/metadata.xml',
                    '!WebContent/resources/**',
                ]
            )

            .pipe(gulpif(vcharts, uglify()))
            .on('error', function (err) {
                console.error('Error in compress task', err.toString());
            })
            .pipe(gulpif('**/*.xml', prettydata({ type: 'minify' })))
            .pipe(ui5preload({
                base: './WebContent/2.00',
                namespace: '',
                fileName: 'library-preload.js'
            }))
            .pipe(gulp.dest('./WebContent/2.00/vistex/ui/widgets/Vcharts'));
    }
)

var heatmap = function(file)
{    
    
    var include = gulpmatch(file, [ '*.js' ]);
       
    var res = include;
    
    console.error(file.path + ': Result = ' + res);
    
    return res;
}

gulp.task(
    'heatmap-2.00',
    function () {

        return gulp.src([
                    //'**/**.+(js|xml|properties)',
                    'WebContent/2.00/vistex/ui/widgets/HeatMap/**/**.+(js|xml)',
                    '!WebContent/2.00/vistex/ui/widgets/HeatMap/library-preload.js',
                    '!WebContent/WEB-INF/web.xml',
                    '!node_modules/**',
                    '!WebContent/model/metadata.xml',
                    '!WebContent/resources/**',
                ]
            )

            .pipe(gulpif(heatmap, uglify()))
            .on('error', function (err) {
                console.error('Error in compress task', err.toString());
            })
            .pipe(gulpif('**/*.xml', prettydata({ type: 'minify' })))
            .pipe(ui5preload({
                base: './WebContent/2.00',
                namespace: '',
                fileName: 'library-preload.js'
            }))
            .pipe(gulp.dest('./WebContent/2.00/vistex/ui/widgets/HeatMap'));
    }
)

var hierarchytree = function(file)
{
        
    var include = gulpmatch(file, [ '*.js' ]);
       
    var res = include;
    
    console.error(file.path + ': Result = ' + res);
    
    return res;
}

gulp.task(
    'hierarchytree-2.00',
    function () {

        return gulp.src([
                    //'**/**.+(js|xml|properties)',
                    'WebContent/2.00/vistex/ui/widgets/HierarchyTree/**/**.+(js|xml)',
                    '!WebContent/2.00/vistex/ui/widgets/HierarchyTree/library-preload.js',
                    '!WebContent/WEB-INF/web.xml',
                    '!node_modules/**',
                    '!WebContent/model/metadata.xml',
                    '!WebContent/resources/**',
                ]
            )

            .pipe(gulpif(hierarchytree, uglify()))
            .on('error', function (err) {
                console.error('Error in compress task', err.toString());
            })
            .pipe(gulpif('**/*.xml', prettydata({ type: 'minify' })))
            .pipe(ui5preload({
                base: './WebContent/2.00',
                namespace: '',
                fileName: 'library-preload.js'
            }))
            .pipe(gulp.dest('./WebContent/2.00/vistex/ui/widgets/HierarchyTree'));
    }
)

var condition = function(file)
{
	
	var exclude = gulpmatch(file, [ 'grid.js', 'knockout.js', 'peg.js', 'tv4.js', 'xlsx_core.js']);
	var include = gulpmatch(file, [ '*.js' ]);	
	var res = include && !exclude;
	
	
	console.error(file.path + ': Result = ' + res);
	
	return res;
}


gulp.task(
    'igrid',
    function () {

        return gulp.src([
                    //'**/**.+(js|xml|properties)',
                    'WebContent/1.00/vistex/ui/widgets/IGrid/**/**.+(js|xml)',                  
                    '!WebContent/1.00/vistex/ui/widgets/IGrid/library-preload.js',
                    '!WebContent/WEB-INF/web.xml',
                    '!node_modules/**',
                    '!WebContent/model/metadata.xml',
                    '!WebContent/resources/**',
                ]
            )

            .pipe(gulpif(condition, uglify()))
            .on('error', function (err) {
                console.error('Error in compress task', err.toString());
            })
            .pipe(gulpif('**/*.xml', prettydata({ type: 'minify' })))
            .pipe(ui5preload({
                base: './WebContent/1.00',
                namespace: '',
                fileName: 'library-preload.js'
            }))
            .pipe(gulp.dest('./WebContent/1.00/vistex/ui/widgets/IGrid'));
    }
)
var controls = function(file)
{
    var include = gulpmatch(file, [ '*.js', '**/*.js']);
    
    var res = include;
    console.error(file.path + ': Result = ' + res);
    
    return res;
}


gulp.task(
    'controls-1.00',
    function () {

        return gulp.src([
                    //'**/**.+(js|xml|properties)',
                    'WebContent/1.00/vistex/ui/controls/**/**.+(js|xml)',
                    '!WebContent/1.00/vistex/ui/controls/library-preload.js',
                    '!WebContent/WEB-INF/web.xml',
                    '!node_modules/**',
                    '!WebContent/model/metadata.xml',
                    '!WebContent/resources/**',
                ]
            )

           .pipe(gulpif(controls, uglify()))
            .on('error', function (err) {
                console.error('Error in compress task', err.toString());
            })
            .pipe(gulpif('**/*.xml', prettydata({ type: 'minify' })))
            .pipe(ui5preload({
                base: './WebContent/1.00',
                namespace: '',
                fileName: 'library-preload.js'
            }))
            .pipe(gulp.dest('./WebContent/1.00/vistex/ui/controls'));
    }
)

var core = function(file)
{
    
    //var exclude = gulpmatch(file, [ '*/plugins/*.js']);
   var exclude = gulpmatch(file, [ 'excelplus-2.5.min.js' ,'xlsx.core.min.js', 'underscore-min.js']);
    var include = gulpmatch(file, [ '*.js' ]);
    
    var res = include && !exclude;
    
    
    console.error(file.path + ': Result = ' + res);
    
    return res;
}



gulp.task(
    'core-1.00',
    function () {

        return gulp.src([
                    //'**/**.+(js|xml|properties)',
                    'WebContent/1.00/vistex/ui/core/**/**.+(js|xml)',
                    '!WebContent/1.00/vistex/ui/core/library-preload.js',
                    '!WebContent/WEB-INF/web.xml',
                    '!node_modules/**',
                    '!WebContent/model/metadata.xml',
                    '!WebContent/resources/**',
                ]
            )

            .pipe(gulpif(core, uglify()))
            .on('error', function (err) {
                console.error('Error in compress task', err.toString());
            })
            .pipe(gulpif('**/*.xml', prettydata({ type: 'minify' })))
            .pipe(ui5preload({
                base: './WebContent/1.00',
                namespace: '',
                fileName: 'library-preload.js'
            }))
            .pipe(gulp.dest('./WebContent/1.00/vistex/ui/core'));
    }
)


var designerRegex = function(file)
{
	
	var exclude = gulpmatch(file, [ '*/StatementEditor/*.js']);
	var exclude1 = gulpmatch(file, [ 'Designer_library.js']);
	var include = gulpmatch(file, [ '*.js' ]);
	var res = include && !exclude && !exclude1;
	console.error(file.path + ': Result = ' + res);
	return res;
}


gulp.task(
    'Designer.v1.0',
    function () {

        return gulp.src([
                    'WebContent/1.00/vistex/ui/widgets/Designer/**/**.+(js|xml|properties)',
                    '!WebContent/1.00/vistex/ui/widgets/Designer/library-preload.js',
                    '!WebContent/WEB-INF/web.xml',
                    '!node_modules/**',
                    '!WebContent/model/metadata.xml',
                    '!WebContent/resources/**',
                ]
            )

            .pipe(gulpif(designerRegex, uglify()))
            .on('error', function (err) {
                console.error('Error in compress task', err.toString());
            })
            .pipe(gulpif('**/*.xml', prettydata({ type: 'minify' })))
            .pipe(ui5preload({
                base: './WebContent/1.00',
                namespace: '',
                fileName: 'library-preload.js'
            }))
            .pipe(gulp.dest('./WebContent/1.00/vistex/ui/widgets/Designer'));
    }
)

gulp.task(
    'Designer-2.00',
    function () {

        return gulp.src([
                    'WebContent/2.00/vistex/ui/widgets/Designer/**/**.+(js|xml|properties)',
                    '!WebContent/2.00/vistex/ui/widgets/Designer/library-preload.js',
                    '!WebContent/WEB-INF/web.xml',
                    '!node_modules/**',
                    '!WebContent/model/metadata.xml',
                    '!WebContent/resources/**',
                ]
            )

            .pipe(gulpif(designerRegex, uglify()))
            .on('error', function (err) {
                console.error('Error in compress task', err.toString());
            })
            .pipe(gulpif('**/*.xml', prettydata({ type: 'minify' })))
            .pipe(ui5preload({
                base: './WebContent/2.00',
                namespace: '',
                fileName: 'library-preload.js'
            }))
            .pipe(gulp.dest('./WebContent/2.00/vistex/ui/widgets/Designer'));
    }
)