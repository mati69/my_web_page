$(document).ready(function () {

    const $doc = $(document);
    const $header = $('header');
    const $main = $('main');
    const $slide = $('.slide');
    const $skills = $('#skills');
    const $projects = $('#projects');
    const $contact = $('#contact');
    const $arrowDown = $('#arrow');
    const $form = $('#contactForm');
    const $submitBtn = $('.submitBtn');

    //ARROW
    $arrowDown.on('click', function () {

        $('body,html').animate({
            scrollTop: $main.offset().top
        }, 1500);
    });

    //HAMBURGER
    $('header div.navIcon').on('click', function () {

        $(this).toggleClass('active');
        $('header nav.mobile').addClass('animation');
        $('header nav.mobile').toggleClass('open');
    });

    $('nav.mobile li a').on('click', function () {

        $('header div.navIcon').removeClass('active');
        $('header nav.mobile').removeClass('open');
    });

    //MENU
    $('li.skills').on('click', function () {

        $('body,html').animate({
            scrollTop: $skills.offset().top
        }, 1000);
    });

    $('li.projects').on('click', function () {

        $('body,html').animate({
            scrollTop: $projects.offset().top
        }, 1000);
    });

    $('li.contact').on('click', function () {

        $('body,html').animate({
            scrollTop: $contact.offset().top
        }, 1000);
    });

    //OPACITY FOR SCROLLING
    $doc.on('scroll', function () {

        const scrollPos = $doc.scrollTop();
        const sectionOffset = $main.offset().top;

        if (scrollPos < sectionOffset) {

            $header.css('opacity', 1 - 1.2 * scrollPos / sectionOffset);
        };
    });

    //FORM
    $form.attr('novalidate', "novalidate");

    $(function () {

        const $inputs = $('form input[required], form textarea[required]');

        const displayFieldError = function (elem) {

            const $fieldRow = elem.closest('.formRow');
            const $fieldError = $fieldRow.find('.fieldError');

            if (!$fieldError.length) {

                const errorText = elem.attr('data-error');
                const $divError = $('<div class="fieldError">' + errorText + '</div>');
                $fieldRow.append($divError);
            };
        };

        const hideFieldError = function (elem) {

            const $fieldRow = elem.closest('.formRow');
            const $fieldError = $fieldRow.find('.fieldError');

            if ($fieldError.length) {

                $fieldError.remove();
            };
        };

        $inputs.on('input keyup', function () {

            const $elem = $(this);
            const pattern = $elem.attr('pattern');

            if (!new RegExp(pattern).test($elem.val())) {

                $elem.addClass('error');

            } else {

                $elem.removeClass('error');
                hideFieldError($elem);
            }
        });

        const checkFieldsErrors = function (elements) {

            let fieldsAreValid = true;

            elements.each(function (i, elem) {

                const $element = $(elem);
                const pattern = $element.attr('pattern');

                if (new RegExp(pattern).test($element.val())) {

                    hideFieldError($element);
                    $element.removeClass('error');

                } else {

                    displayFieldError($element);
                    $element.addClass('error');
                    fieldsAreValid = false;
                };
            });

            return fieldsAreValid;
        };

        $form.on('submit', function (e) {

            e.preventDefault();

            if (checkFieldsErrors($inputs)) {

                const dataToSend = $form.serializeArray();
                $submitBtn.prop('disabled', true);
                $submitBtn.addClass('isBusy');
                $form.find('.sendError').remove();

                $.ajax({

                    url: $form.attr('action'),
                    type: $form.attr('method'),
                    dataType: 'json',
                    data: dataToSend,

                    success: function (ret) {

                        if (ret.errors) {

                            const r = ret.errors.map(function (el) {

                                return '[name="' + el + '"]';
                            });

                            checkFieldsErrors($form.find(r.join(',')));

                        } else {

                            if (ret.status == 'ok') {

                                $form.replaceWith('<div class="formSendSuccess"><strong>Wiadomość została wysłana</strong><span>Dziękuję za kontakt. Postaram się odpowiedzieć jak najszybciej</span></div>');
                            }

                            if (ret.status == 'error') {

                                $submitBtn.after('<div class="sendError">Wysyłanie wiadomości nie powiodło się</div>');
                            }
                        }
                    },

                    error: function (error) {

                        console.error('Wystąpił błąd z połączeniem');
                        alert("Wystąpił błąd z połączeniem! Proszę spróbować później.");
                    },

                    complete: function () {

                        $submitBtn.prop('disabled', false);
                        $submitBtn.removeClass('isBusy');
                    }
                });
            };
        });
    });
});
