/*
 * JBoss, Home of Professional Open Source.
 * Copyright Red Hat, Inc., and individual contributors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

describe('Plugin should be installed', function() {
    it("crypto plugin should exist", function() {
        expect(AeroGear.crypto).toBeDefined();
        expect(typeof AeroGear.crypto == 'object').toBe(true);
    });

    it("should contain a encrypt function", function() {
        expect(AeroGear.crypto.encrypt).toBeDefined();
        expect(typeof AeroGear.crypto.encrypt == 'function').toBe(true);
    });

    it("should contain a decrypt function", function() {
        expect(AeroGear.crypto.decrypt).toBeDefined();
        expect(typeof AeroGear.crypto.decrypt == 'function').toBe(true);
    });
});

describe('Password based key derivation support (PBKDF2)', function () {
    it("Password validation with random salt provided", function () {
        AeroGear.crypto.deriveKey( function(rawPassword) {
            expect(rawPassword).toEqual(ENCRYPTED_PASSWORD);
        }, errorHandler, PASSWORD );
    });
});

describe('Password based encrytion with GCM', function () {
    it("Encrypt/Decrypt password", function() {
        AeroGear.crypto.deriveKey( function(rawPassword) {
            var options = {
                    IV: BOB_IV,
                    AAD: BOB_AAD,
                    key: rawPassword,
                    data: PLAIN_TEXT
                };
            AeroGear.crypto.encrypt( function(cipherText) {
                options.data = cipherText;
                AeroGear.crypto.decrypt (function(plainText) {
                    expect(plainText).toEqual(PLAIN_TEXT);
                }, options );
            }, options ); 
        }, errorHandler, PASSWORD );
    });
});    

describe('Symmetric encrytion with GCM', function () {
    it("Encrypt", function() {
        var options = {
                IV: BOB_IV,
                AAD: BOB_AAD,
                key: BOB_SECRET_KEY,
                data: MESSAGE
            };
        AeroGear.crypto.encrypt( function(cipherText) {
            expect(cipherText).toEqual(CIPHERTEXT);
        }, options ); 
    });

    it("Encrypt/Decrypt", function() {
        var options = {
                IV: BOB_IV,
                AAD: BOB_AAD,
                key: BOB_SECRET_KEY,
                data: MESSAGE
            };
        AeroGear.crypto.encrypt( function(cipherText) {
            AeroGear.crypto.decrypt (function(plainText) {
                expect(plainText).toEqual(MESSAGE);
            }, options );
        }, options ); 
    });
});

describe('Digital signatures', function () {
    it("Encrypt/Decrypt", function() {
        AeroGear.crypto.KeyPair(function(keyPair) {
            AeroGear.crypto.KeyPair(function(keyPairPandora) {
                var options = {
                    IV: BOB_IV,
                    AAD: BOB_AAD,
                    key: new AeroGear.crypto.KeyPair(keyPair.privateKey, keyPairPandora.publicKey),
                    data: PLAIN_TEXT
                };
                AeroGear.crypto.encrypt(function (cipherText) {
                    options.key = new AeroGear.crypto.KeyPair(keyPairPandora.privateKey, keyPair.publicKey);
                    options.data = cipherText;
                    AeroGear.crypto.decrypt(function (plainText) {
                        expect(plainText).toEqual(PLAIN_TEXT);
                    }, options);
                }, options);
            });
        });
    });
});

function errorHandler(message) {
    throw new Error('test failed ' + message);
}