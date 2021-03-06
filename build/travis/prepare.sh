#!/usr/bin/env bash

main() {
    if [[ "${RUN_MODE}" == "npm" ]]; then
        return
    fi

    svc="${TRAVIS_BUILD_DIR}/build/travis/nginx.service"
    skeleton="${TRAVIS_BUILD_DIR}/resources/test-skel"

    sudo cp "${svc}" /etc/systemd/system/ && sudo systemctl daemon-reload
    sudo mkdir -p /var/www /etc/nginx/sites-enabled /etc/nginx/sites-available
    sudo chmod -R 777 /etc/nginx /var/www

    sudo chmod 777 "${skeleton}"
    sudo chown -R www-data:www-data "${skeleton}"
    sudo chown -R root:root "${skeleton}/protected"
    sudo chmod 600 "${skeleton}/protected/forbidden"
}

main
