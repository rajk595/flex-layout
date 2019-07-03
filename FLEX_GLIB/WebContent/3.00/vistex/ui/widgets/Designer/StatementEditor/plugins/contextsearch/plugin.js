(function ($) {
    function ContextSearch(editor) {
        this.editor = editor;
        this.contextInput = '';
        this.timeoutId = null;

        if (ContextSearch.caller !== ContextSearch.getInstance) {
            throw new Error("Object cannot be instantiated");
        }
    }

    ContextSearch.instances = [];
    ContextSearch.timeoutDelay = 500;
    ContextSearch.startObserveCount = 1;
    ContextSearch.defaults = {
        tableDisplayField: 'Description',
        tableValueField: 'TableName',
        fieldDisplayField: 'Label',
        fieldValueField: 'FieldName',
        fieldsNode: 'Fields'
    };
    ContextSearch.class = {
        suggestions: 'vizi-context-suggestions',
        contextField: 'vizi-context-field',
        contextTable: 'vizi-context-table',
        stateIcon: 'vizi-state-icon',
        expandedIcon: 'vizi-icon-minus',
        collapsedIcon: 'vizi-icon-plus',
        suggestionFilter: 'vizi-context-suggestion-filter'
    };
    ContextSearch.keyCodeHelper = {
        up: 38,
        down: 40,
        left: 37,
        right: 39,
        enter: 13,
        space:32,
        tab: 9,
        backSpace: 8,
        del: 46,
        help: 115,
        escape: 27
    };
    ContextSearch.getInstance = function (editor) {
        for (var i in this.instances) {
            if (this.instances[i].id === editor.id) {
                return this.instances[i].instance;
            }
        }
        this.instances.push({
            id: editor.id,
            instance: new ContextSearch(editor)
        });
        return this.instances[this.instances.length - 1].instance;
    };
    ContextSearch.prototype.deleteSuggestions = function () {
        if (this.shortcutActivated) {
            return false;
        }
        if (!$('.cke_dialog').is(':visible')) {
            $('.' + ContextSearch.class.suggestions).remove();
        }

        var contextList = $('.' + ContextSearch.class.suggestions).filter(function () {
            return $(this).parents('.cke_dialog').length <= 0;
        });
        contextList.remove();
    };

    ContextSearch.prototype.enableAutoComplete = function (typedChar) {
        var editor = this.editor,
            range = editor.getSelection().getRanges()[0],
            startNode = range.startContainer,
            startElm = startNode.$,
            parentElm = startElm.parentNode,
            words = [],
            totalLetters,
            currentWord = '',
            currentElement,
            startOffset,
            currentNode,
            wordIndex,
            currentIndex,
            i,k;

        //if (startNode.type == CKEDITOR.NODE_TEXT) {
        currentNode = startElm;
        startOffset = range.startOffset;
        currentWord = startElm.textContent;
        //currentWord = currentWord.slice(0, startOffset) + (typedChar || '') + currentWord.slice(startOffset, currentWord.length);


        var normalText, allChilds = parentElm.childNodes || [];

        for (k = 0; k < allChilds.length; k++) {
            var r = allChilds[k];
            normalText = [];
            if (r.outerHTML) {
                normalText = [r.innerText];
            }
            else if (r.textContent) {
                normalText = r.textContent.replace(/\u200B/g, '');
                normalText = normalText.split(' ');
            }
            if (r == startElm) {
                totalLetters = 0;
                wordIndex = words.length + 1;
                for (i = 0; i < normalText.length; i++) {
                    totalLetters += normalText[i].length;
                    if (typeof normalText[i + 1] !== 'undefined') {
                        totalLetters += 1;
                    }
                    if (totalLetters >= startOffset) {
                        wordIndex += i;
                        allChilds.length = 0;
                        break;
                    }
                }
            }
            words = words.concat(normalText);
        }

        //}
        // console.log('WordIndex', wordIndex);
        // console.log('words', words);
        this.deleteSuggestions();
        this.wordIndex = wordIndex;
        if (currentWord) {
            currentWord = currentWord.replace(/\u200B/g, '');
            if (currentWord.substr(0, 2) === '&&') {
                this.contextInput = currentWord.slice(2, currentWord.length);
                return true;
            } else if (this.shortcutActivated) {
                if (typedChar === ' ')
                    this.contextInput = ' ';
                else
                    this.contextInput = currentWord;
                return true;
            }
        }
        else {
            this.contextInput = '';
        }
    };

    ContextSearch.prototype.onSuggestionSelect = function (tableName, fieldName, field, contextId, fromDialog, showDataAs) {
        if (tableName || fieldName || field || contextId || fromDialog || showDataAs) {
            var contextSearch = this,
                editor = contextSearch.editor,
                selection = editor.getSelection(),
                range = selection.getRanges()[0],
                currentElement,
                sibling,
                replacedContent,
                words,
                element = range.startContainer.$,
                textContent,
                j;

            if (element && element.nodeType === CKEDITOR.NODE_TEXT) {
                element = element.parentElement || element.parentNode;
            }
            textContent = $(element).html();

            if (element && element.nodeType === CKEDITOR.NODE_TEXT && (element.previousSibling || element.nextSibling)) {
                currentElement = element;
                while (element.nextSibling && element.nextSibling.nodeType === CKEDITOR.NODE_TEXT) {
                    sibling = element.nextSibling;
                    if (sibling) {
                        element.remove();
                    }
                    element = sibling;
                }
                element = currentElement;
                while (element.previousSibling && element.previousSibling.nodeType === CKEDITOR.NODE_TEXT) {
                    sibling = element.previousSibling;
                    if (sibling) {
                        element.remove();
                    }
                    element = sibling;
                }
            }

            replacedContent = '<span><field contenteditable="false"' + ' Context=' + contextId + '-' + field + ' showdataas=' + showDataAs + '>' + contextId + '-' + field + '</field></span>';

            /* Temp Fix */
            if (textContent === '​​​​​​​<br>') {
                textContent = '';
            }

            if (textContent) {
                words = [];
                for (j = 0; j < element.childNodes.length; j++) {
                    var r = element.childNodes[j];
                    if (r.outerHTML) {
                        words.push(r.outerHTML);
                    }
                    else if (r.textContent) {
                        r.textContent = r.textContent.replace(/\u200B/g, '');
                        words = words.concat(r.textContent.split(' '));
                    }
                }
                // console.log('Replacing WordIndex', contextSearch.wordIndex);
                if (contextSearch.wordIndex > words.length)
                    contextSearch.wordIndex = words.length - 1;
                //if (tableName && tableName.toLowerCase().indexOf(words[words.length - 1].toLowerCase().replace(/\s/, '')) > -1) {
                //    words[words.length - 1] = replacedContent;
                //}
                //else

                if ((typeof contextSearch.wordIndex === 'undefined') || contextSearch.wordIndex === 0) {
                    words.push(replacedContent);
                } else {
                    var tempWord,
                        pattern = /\s$/g,
                        result = pattern.exec(words[contextSearch.wordIndex - 1]),
                        tableNameTemp,
                        fieldNameTemp,
                        testValue;
                    //if (tableName.indexOf('-') > -1) {
                    //    tableNameTemp = tableName.split('-')[0];
                    //    fieldNameTemp = tableName.split('-')[1];
                    //    if (words.indexOf(tableNameTemp) > -1) {
                    //        testValue = words[words.indexOf(tableNameTemp)] + words[words.indexOf(tableNameTemp) + 1] + words[words.indexOf(fieldNameTemp)];
                    //        if (testValue === tableName) {
                    //            contextSearch.wordIndex = words.indexOf(tableNameTemp);
                    //            words[contextSearch.wordIndex] = replacedContent;
                    //            //words.splice([words.indexOf(tableNameTemp)], 2);
                    //        }
                    //    }
                    //}
                    if (words[contextSearch.wordIndex - 1] && words[contextSearch.wordIndex - 1].indexOf('-') > -1) {
                        tempWord = words[contextSearch.wordIndex - 1].split('-')[0];
                    }
                    else {
                        if (tableName && words[contextSearch.wordIndex - 1])
                            tempWord = tableName.toLowerCase().replace(/\s/g, '').replaceAll('\u200b', '').indexOf(words[contextSearch.wordIndex - 1].toLowerCase().replace(/\s/g, '').replaceAll('\u200b', '')) > -1;
                    }
                    if (!result && tempWord && words[contextSearch.wordIndex + 1] !== '') {
                        contextSearch.wordIndex = contextSearch.wordIndex - 1;
                    }
                    if (contextSearch.contextInput === ' ') {
                        words[contextSearch.wordIndex] = replacedContent;
                    }
                    else if (fromDialog && words[contextSearch.wordIndex])
                        words[contextSearch.wordIndex + 1] = words[contextSearch.wordIndex];
                    else
                        words[contextSearch.wordIndex] = replacedContent;
                }
            }
            else {
                words = [replacedContent];
            }
            element.innerHTML = words.join(' ');
            contextSearch.shortcutActivated = false;
            contextSearch.deleteSuggestions();
            editor.focus();
            range = editor.createRange();
            range.moveToElementEditablePosition(editor.editable(), true);
            editor.getSelection().selectRanges([range]);
        }
    };
    ContextSearch.prototype.getContextFields = function (selection, showAll) {
        if (null !== this.timeoutId) {
            clearTimeout(this.timeoutId);
        }
        this.timeoutId = setTimeout(this.timeoutCallback.bind(this, selection, showAll), ContextSearch.timeoutDelay);
    };
    ContextSearch.prototype.timeoutCallback = function (selection, showAllContexts, getListHTML, forContext) {
        var contextSearch = this,
            str = contextSearch.contextInput;

        if (!showAllContexts && str.length < ContextSearch.startObserveCount) {
            contextSearch.deleteSuggestions();
            return;
        }


        var editor = contextSearch.editor,
            elementId = editor.element.getId(),
            editorRef = $('#' + elementId),
            editorParentRef = editorRef.parent(),
            suggestionsRef,
            range = selection.getRanges()[0],
            startOffset = parseInt(range.startOffset - str.length) || 0,
            element = range.startContainer.$,
            editorConfig = angular.copy(editor.config) || {},
            autoCompleteData = angular.copy(editorConfig.autoCompleteData),
            tableDisplayField = editorConfig.tableDisplayField || ContextSearch.defaults.tableDisplayField,
            tableValueField = editorConfig.tableValueField || ContextSearch.defaults.tableValueField,
            fieldDisplayField = editorConfig.fieldDisplayField || ContextSearch.defaults.fieldDisplayField,
            fieldValueField = editorConfig.fieldValueField || ContextSearch.defaults.fieldValueField,
            fieldsNode = editorConfig.fieldsNode || ContextSearch.defaults.fieldsNode,
            htmlString = '',
            textTemp = element.wholeText || element.nodeValue || element.textContent || element.innerText || element.innerHtml || '',
            nodeValues = textTemp.split(' '),
            filteredWord,
            matchingDataTemp = [],
            matchingDataFlag,
            k;
        /* Get matched entries */
        if (nodeValues[nodeValues.length - 1].indexOf('-') > -1)
            str = nodeValues[nodeValues.length - 1];
        if (forContext)
            str = contextSearch.textFilter || '';
        var strTemp = str.split(new RegExp('\\s+'));
        if (strTemp.length > 1)
            str = strTemp[strTemp.length - 1];
        // console.log(contextSearch.textFilter);
        var matchingData = [],
            searchSplit = str.replace(/\s/g, '').split('-'),
            tableName = searchSplit[0],
            fieldName = searchSplit[1];
        if (showAllContexts && !str) {
            matchingData = autoCompleteData;
        }
        else {
            for (k = 0; k < autoCompleteData.length; k++) {
                var record = autoCompleteData[k];
                record[fieldsNode] = record[fieldsNode].filter(function (field) {
                    if (tableName && fieldName) {
                        if ((record[tableDisplayField].replace(/\s/g, '').replaceAll('\u200b', '').toLowerCase() + '-' + field[fieldDisplayField].replace(/\s/g, '').replaceAll('\u200b', '').toLowerCase()).indexOf(tableName.toLowerCase().replace(/\s/g, '').replaceAll('\u200b', '') + '-' + fieldName.replace(/\s/g, '').replaceAll('\u200b', '').toLowerCase()) > -1) {
                            return true;
                        }
                    } else if (tableName) {
                        if (field[fieldDisplayField].replace(/\s/g, '').replaceAll('\u200b', '').toLowerCase().indexOf(tableName.toLowerCase().replace(/\s/g, '').replaceAll('\u200b', '')) > -1 ||
                            record[tableDisplayField].replace(/\s/g, '').replaceAll('\u200b', '').toLowerCase().indexOf(tableName.toLowerCase().replace(/\s/g, '').replaceAll('\u200b', '')) > -1) {
                            return true;
                        }
                    }
                });
                if (record[fieldsNode] && record[fieldsNode].length) {
                    matchingData.push(record);
                    contextSearch.contextInput = str;
                    matchingDataFlag = true;
                }
            }
        }
        /* Filter matchingData */
        filteredWord = nodeValues[nodeValues.length - 1] || str;
        var pattern = /\s$/g;
        var result = pattern.exec(filteredWord);
        if ((result && result.index >= 0) || matchingDataFlag) {
            matchingDataTemp = matchingData;
        }
        else {
            var strTemp = filteredWord.split(new RegExp('\\s+'));
            if (strTemp.length > 1)
                filteredWord = strTemp[strTemp.length - 1];
            filteredWord = filteredWord.toLowerCase().replace(/\s/g, '').replaceAll('\u200b', '');
            if (filteredWord && matchingData && !forContext) {
                for (var i in matchingData) {
                    if (matchingData[i] &&
                        matchingData[i].description &&
                        matchingData[i].description.toLowerCase().replace(/\s/g, '').replaceAll('\u200b', '').indexOf(filteredWord) > -1) {
                        matchingDataTemp.push(matchingData[i]);
                        contextSearch.contextInput = filteredWord;
                    }
                }
            }
        }
        // }
        ContextSearch.filteredWord = filteredWord;
        ContextSearch.fieldname = fieldName;
        if (forContext)
            matchingDataTemp = autoCompleteData;
        if (matchingDataTemp && matchingDataTemp.length)
            htmlString += '<div style="color:#23527c;font-weight:bold;" class="vizi-context-suggestions-header"><div class="col-xs-6">Context</div><div class="col-xs-6">Show Description</div></div><div class="vizi-context-suggestions-data">';

        for (var j = 0; j < matchingDataTemp.length; j++) {
            var record = matchingDataTemp[j];
            htmlString += '<ul>';
            htmlString += '<li id="' + record[tableValueField] + '">';
            htmlString += '<span class="' + ContextSearch.class.stateIcon + ' ' + ContextSearch.class.expandedIcon + '"></span>';
            htmlString += '<b class="' + ContextSearch.class.contextTable + '">' + record[tableDisplayField] + '</b>';
            htmlString += '<ul>';
            if (record[fieldsNode]) {

                for (var m = 0; m < record[fieldsNode].length; m++) {
                    var field = record[fieldsNode][m];
                    htmlString += '<li class="' + ContextSearch.class.contextField + '" id="' + field[fieldValueField] + '" tablename="' + ContextSearch.filteredWord + '" tablename="' + ContextSearch.fieldname + '">';
                    htmlString += '<a>' + field[fieldDisplayField] + '</a>';
                    htmlString += '<input type="checkbox" class="pull-right" title="Show data as description"></input>';
                    htmlString += '</li>';
                }
            }
            htmlString += '</ul>';
            htmlString += '</li>';
            htmlString += '</ul>';
        }

        if (matchingDataTemp && matchingDataTemp.length)
            htmlString += '</div>';
        //console.log(matchingData, matchingDataTemp, tableName, fieldName);
        matchingData = matchingData;
        contextSearch.deleteSuggestions();
        suggestionsRef = $('.' + ContextSearch.class.suggestions);
        if (suggestionsRef.length && !forContext) {
            suggestionsRef
                .remove()
        }
        if (!htmlString)
            htmlString = '<b>No context to display</b>';
        if (getListHTML) {
            return htmlString;
        }
        suggestionsRef = $('.' + ContextSearch.class.suggestions);
        //if (suggestionsRef.length) {
        //    suggestionsRef
        //        .empty()
        //        .append(htmlString)
        //        .css(contextSearch.getCaretYPosition());
        //} else {
        htmlString = '<div class="' + ContextSearch.class.suggestions + '" tabindex="0">' + htmlString + '</div>';
        $(htmlString).insertAfter(editorParentRef);
        suggestionsRef = $('.' + ContextSearch.class.suggestions);

        function toggleMenu(e) {
            $(this).parent('li').find('.' + ContextSearch.class.stateIcon).toggleClass(ContextSearch.class.collapsedIcon);
            $(this).parent('li').find('ul').slideToggle();
        }

        function onKeyDown(objEvent) {
            if (objEvent.keyCode !== ContextSearch.keyCodeHelper.tab) {
                contextSearch.onKeyNavigation($(this), objEvent);
            }
        }

        suggestionsRef
            .keydown(onKeyDown)
            .css(contextSearch.getCaretYPosition())
            .click(function (e) {
                e.stopPropagation();
            });

        suggestionsRef.find('.' + ContextSearch.class.contextTable).click(toggleMenu);
        suggestionsRef.find('.' + ContextSearch.class.stateIcon).click(toggleMenu);
        //}

        suggestionsRef.css({
            'max-height': suggestionsRef.parent().height(),
            'min-height': 150,
            'overflow': 'hidden'
        });
        function linkSelect(e) {
            var _this = $(this),
                showDataAs = $(e.currentTarget).find('input').is(':checked');
            if (e.target.tagName === 'A') {
                contextSearch.onSuggestionSelect(_this.parent().prev('.' + ContextSearch.class.contextTable).text(), _this.text(), _this.attr('id'), $(_this.parents()[1]).attr('id'), '', showDataAs);
            }
            if (showDataAs) {
                return true;
            }
        };

        suggestionsRef.find('.' + ContextSearch.class.contextField).click(linkSelect);
        return htmlString;

        //else
        //    return '';
    };
    ContextSearch.prototype.onKeyNavigation = function (itemRef, objEvent, enter, fromDialog, showDataAs) {

        var contextSearch = this,
            eleList = itemRef,
            eleListItems = itemRef.find('.' + ContextSearch.class.contextField),
            eleFocus = eleList.find('li.focus'),
            keyCode = objEvent.which;

        if (enter) {
            keyCode = ContextSearch.keyCodeHelper.enter;
        }

        switch (keyCode) {
            case ContextSearch.keyCodeHelper.up:
            case ContextSearch.keyCodeHelper.down:
                objEvent.preventDefault();
                objEvent.stopPropagation();

                contextSearch.selectElementByKey(
                    eleListItems,
                    eleList,
                    eleFocus,
                    objEvent
                );
                break;
            case ContextSearch.keyCodeHelper.enter:
                contextSearch.onSuggestionSelect(eleFocus.attr('tablename'), eleFocus.attr('fieldname'), eleFocus.attr('id'), eleFocus.parents('li').attr('id'), fromDialog, showDataAs);
                objEvent.preventDefault();
                objEvent.stopPropagation();
                break;
        }
    };
    ContextSearch.prototype.getCaretYPosition = function () {

        var editor = this.editor,
            dummyElement = CKEDITOR.dom.element.createFromHtml('<span>&nbsp;</span>'),
            bookmarks = editor.getSelection().createBookmarks(),
            editorIframe = $(editor.container.$).find('.cke_contents iframe'),
            editorIframeNode = editorIframe.get(0),
            elementRef = dummyElement.$,
            cursorPosition = {
                left: 0,
                top: 0
            };

        editor.insertElement(dummyElement);
        while (elementRef.offsetParent) {
            cursorPosition.left += elementRef.offsetLeft;
            cursorPosition.top += elementRef.offsetTop;
            elementRef = elementRef.offsetParent;
        }
        cursorPosition.left += elementRef.offsetLeft;
        cursorPosition.top += elementRef.offsetTop;
        cursorPosition.top += 40 + (editorIframeNode ? $(editorIframeNode).position().top : 0);
        dummyElement.remove();
        editor.getSelection().selectBookmarks(bookmarks);
        return cursorPosition;
    };
    ContextSearch.prototype.selectElementByKey = function (items, list, focus, event) {
        var nextElement = {},
            lastElement = '',
            itemHeight = focus.outerHeight(),
            focusIndex = 0,
            itemsLen = 0;

        if (!items || items.length === 0) return false;

        event.preventDefault();
        event.stopPropagation();

        itemsLen = items.length;
        focusIndex = items.index(focus);
        items.removeClass('focus');

        switch (event.which) {
            case ContextSearch.keyCodeHelper.up:
                nextElement = items[focusIndex - 1];
                lastElement = items[items.length - 1];

                if (focusIndex === 0 || focusIndex === -1) {
                    list.scrollTop(itemHeight * itemsLen);
                } else if (focusIndex < itemsLen - 6) {
                    list.scrollTop(list.scrollTop() - itemHeight - 1);
                }
                break;
            case ContextSearch.keyCodeHelper.down:
                nextElement = items[focusIndex + 1];
                lastElement = items[0];

                if (focusIndex === itemsLen - 1) {
                    list.scrollTop(0);
                } else if (focusIndex > 5) {
                    list.scrollTop(list.scrollTop() + itemHeight + 1);
                }
                break;
            default:
                console.warn('selectElementByKey: unsupported key');
        }

        if (focus && (!focus.length || (!nextElement))) {
            $(lastElement).addClass('focus');
        } else {
            $(nextElement).addClass('focus');
        }
    };


    /* Add plugin */
    CKEDITOR.plugins.add('contextsearch', {
        icons: '',
        init: function (editor) {
            var contextSearch = ContextSearch.getInstance(editor);

            // editor.addContentsCss('library/ckeditor/plugins/contextsearch/plugin.css');

            CKEDITOR.dialog.add('testOnly', function (editor) {
                var htmlStringTemp = contextSearch.timeoutCallback(contextSearch.editor.getSelection(), true, true, true),
                    htmlString,
                    dialogConfig;
                if (!htmlStringTemp) {
                    htmlString = '<div class="text-center">No context to display</div>';
                }
                else
                    htmlString = '<input placeholder="Filter" class="form-control ' + ContextSearch.class.suggestionFilter + '" ng-model="' + ContextSearch.filterValue + '"/><div class="' + ContextSearch.class.suggestions + '" tabindex="-1">' + htmlStringTemp + '</div>'
                dialogConfig = {
                    title: 'Context',
                    resizable: CKEDITOR.DIALOG_RESIZE_BOTH,
                    minWidth: 300,
                    minHeight: 200,
                    maxHeight: 350,
                    contents: [
                        {
                            id: 'contextsearch',
                            label: 'Context Search',
                            elements: [
                                {
                                    type: 'html',
                                    html: htmlString
                                }
                            ]
                        }
                    ],
                    onShow: function () {
                        var suggestionsRef = $(this.parts.contents.$).find('.' + ContextSearch.class.suggestions);
                        $(this.parts.contents.$).css({
                            'min-height': 150,
                            'max-height': 350,
                            'min-width': 150,
                            'overflow': 'hidden'
                        })
                        function toggleMenu(e) {
                            $(this).parent('li').find('.' + ContextSearch.class.stateIcon).toggleClass(ContextSearch.class.collapsedIcon);
                            $(this).parent('li').find('ul').slideToggle();
                        }

                        function linkSelect(e) {
                            var _this = $(this), showDataAs;
                            showDataAs = $(e.currentTarget).find('input').is(':checked');

                            if (e.target.tagName === 'A' || e.target.tagName === 'LI') {
                                suggestionsRef.find('.' + ContextSearch.class.contextField).removeClass('focus');
                                _this.toggleClass('focus');
                            }
                            if (showDataAs) {
                                contextSearch.showDataAs = true;
                                return true;
                            }
                            else {
                                contextSearch.showDataAs = false;
                            }
                        }
                        contextSearch.textFilter = $('.' + ContextSearch.class.suggestionFilter).val();
                        var htmlString = contextSearch.timeoutCallback(contextSearch.editor.getSelection(), true, true, true);
                        if (!htmlString)
                            htmlString = '<div class="text-center">No context to display</div>';
                        if (!$('.' + ContextSearch.class.suggestions).length && htmlString) {
                            htmlString = '<div class="' + ContextSearch.class.suggestions + '" tabindex="0">' + htmlString + '</div>'
                            $('.' + ContextSearch.class.suggestionFilter).after(htmlString);
                            suggestionsRef = $(this.parts.contents.$).find('.' + ContextSearch.class.suggestions);
                        }
                        else
                            $('.' + ContextSearch.class.suggestions).html(htmlString);
                        suggestionsRef.find('.' + ContextSearch.class.contextField).click(linkSelect);
                        suggestionsRef.find('.' + ContextSearch.class.contextTable).click(toggleMenu);
                        suggestionsRef.find('.' + ContextSearch.class.stateIcon).click(toggleMenu);
                        suggestionsRef.find('.' + ContextSearch.class.contextField).removeClass('focus');
                    },
                    onLoad: function () {
                        var dialogRef = this,
                            dialogElm,
                            suggestionsRef,
                            suggestionFilter;

                        dialogElm = $(this.parts.contents.$);
                        suggestionFilter = dialogElm.find('.' + ContextSearch.class.suggestionFilter);
                        suggestionsRef = dialogElm.find('.' + ContextSearch.class.suggestions);

                        /* Dialog Events */
                        dialogElm
                            .keydown(function (objEvent) {
                                if (objEvent.keyCode === ContextSearch.keyCodeHelper.escape) {
                                    dialogRef.hide();
                                }
                            });

                        /* Filter Events*/

                        suggestionFilter.keyup(function (objEvent) {

                            contextSearch.textFilter = $('.' + ContextSearch.class.suggestionFilter).val();
                            var htmlString = contextSearch.timeoutCallback(contextSearch.editor.getSelection(), true, true, true);
                            if (!htmlString) {
                                htmlString = '<div class="text-center">No context to display</div>';
                            }
                            $('.' + ContextSearch.class.suggestions).html(htmlString);
                            suggestionsRef.find('.' + ContextSearch.class.contextField).click(linkSelect);
                            suggestionsRef.find('.' + ContextSearch.class.contextTable).click(toggleMenu);
                            suggestionsRef.find('.' + ContextSearch.class.stateIcon).click(toggleMenu);
                        });

                        /* List Events */
                        //todo move these  attachment of events to common place.

                        function toggleMenu(e) {
                            $(this).parent('li').find('.' + ContextSearch.class.stateIcon).toggleClass(ContextSearch.class.collapsedIcon);
                            $(this).parent('li').find('ul').slideToggle();
                        }

                        suggestionsRef
                            .css({
                                'max-height': suggestionsRef.parent().height(),
                                'min-height': 150,
                                'overflow': 'hidden'
                            })
                            .click(function (e) {
                                e.stopPropagation();
                            });

                        suggestionsRef.find('.' + ContextSearch.class.contextTable).click(toggleMenu);
                        suggestionsRef.find('.' + ContextSearch.class.stateIcon).click(toggleMenu);

                        function linkSelect(e) {
                            var _this = $(this);

                            suggestionsRef.find('.' + ContextSearch.class.contextField).removeClass('focus');
                            _this.toggleClass('focus');
                        }

                        suggestionsRef.find('.' + ContextSearch.class.contextField).click(linkSelect);
                    },
                    onOk: function () {
                        if ($(this.parts.contents.$).find('li.focus').parents('li').length)
                            contextSearch.onKeyNavigation($(this.parts.contents.$).find('li.focus').parents('li'), event, true, true, contextSearch.showDataAs);
                    },
                    onHide: function () {
                        suggestionsRef = $('.' + ContextSearch.class.suggestions);
                        contextSearch.textFilter = '';
                        $('.' + ContextSearch.class.suggestionFilter).val('');
                        this.reset();
                    }
                };
                return dialogConfig;
            });

            /* Add to Toolbar */
            editor.ui.addButton('contextsearch', {
                name: 'contextsearch',
                label: 'Context',
                className: 'vizi-contextsearch',
                command: 'contextsearch'
            });

            editor.addCommand('contextsearch', new CKEDITOR.dialogCommand('testOnly'));

            /* Register Events */
            editor.on('key', function (event) {
                var suggestionsRef = $('.' + ContextSearch.class.suggestions);

                if (event.data.keyCode === ContextSearch.keyCodeHelper.down && suggestionsRef.is(':visible')) {
                    event.cancel();
                    suggestionsRef.focus()
                        .find('.' + ContextSearch.class.contextField + ':first')
                        .addClass('focus');
                }
            });

            editor.on('contentDom', function (e) {
                var editable = editor.editable();
                var css = 'field[showdataas="true"]::after {' +
                    'content: \' \';' +
                    'position: absolute;' +
                    'font-family: FontAwesome;' +
                    'background: #0e8fd0;' +
                    'color: #ffffff;' +
                    'right: -5px;' +
                    'top:-4px;' +
                    'font-size: 10px;' +
                    'width: 12px;' +
                    'transform: rotate(-35deg);' +
                    'height: 14px;}' +
                    'field {position:relative;display:inline-flex;overflow:hidden;background-color: gray;color: white;padding: 2px;}',
                    head = editor.document.$.head;
                if (head) {
                    var style = document.createElement('style');
                    style.appendChild(document.createTextNode(css));
                    head.appendChild(style);

                }
                editor.document.on('click', function () {
                    contextSearch.shortcutActivated = false;
                    contextSearch.deleteSuggestions();
                });

                $(document).on('click', function () {
                    contextSearch.shortcutActivated = false;
                    contextSearch.deleteSuggestions();
                });

                editable.attachListener(editable, 'keyup', function (evt) {
                    if (evt.data.$.which === ContextSearch.keyCodeHelper.backSpace) {
                        contextSearch.deleteSuggestions();
                        contextSearch.enableAutoComplete(contextSearch.editor.getSelection());
                        if (contextSearch.contextInput) {
                            contextSearch.getContextFields(contextSearch.editor.getSelection());
                        }
                    }
                });

                editable.attachListener(editable, 'keydown', function (evt) {
                    if (evt.data.$.ctrlKey && evt.data.$.which === ContextSearch.keyCodeHelper.space) {
                        contextSearch.openDialog = true;
                        contextSearch.shortcutActivated = true;
                        contextSearch.enableAutoComplete();
                        var htmlString = contextSearch.timeoutCallback(contextSearch.editor.getSelection(), true);
                        $('.' + ContextSearch.class.suggestions).css({
                            'min-height': 150,
                            'min-width': 150,
                            'max-height': 350,
                            'overflow': 'hidden'
                        })
                    }
                    else {
                        contextSearch.deleteSuggestions();
                        contextSearch.shortcutActivated = true;
                        contextSearch.enableAutoComplete(String.fromCharCode(evt.data.$.which));
                        if (contextSearch.contextInput && contextSearch.openDialog) {
                            if (contextSearch.contextInput === ' ') {
                                contextSearch.openDialog = false;
                                contextSearch.deleteSuggestions();
                                $('.context-suggestions').remove()
                                // console.log('delete');
                            }
                            else
                                contextSearch.getContextFields(contextSearch.editor.getSelection(), true);
                        }
                    }
                });
            });
        }
    });
})
    (jQuery);