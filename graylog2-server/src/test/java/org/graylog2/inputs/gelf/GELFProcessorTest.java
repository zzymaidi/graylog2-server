/**
 * Copyright 2012, 2013 Lennart Koopmann <lennart@socketfeed.com>
 *
 * This file is part of Graylog2.
 *
 * Graylog2 is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Graylog2 is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with Graylog2.  If not, see <http://www.gnu.org/licenses/>.
 *
 */

package org.graylog2.inputs.gelf;

import org.graylog2.gelf.GELFProcessor;
import org.graylog2.gelf.GELFMessage;
import org.graylog2.plugin.Tools;
import org.graylog2.GraylogServerStub;
import org.graylog2.TestHelper;
import org.graylog2.plugin.Message;
import org.joda.time.DateTime;
import org.junit.Test;
import static org.junit.Assert.*;

public class GELFProcessorTest {

    public final static double usedTimestamp = Tools.getUTCTimestampWithMilliseconds();
    public final static String GELF_JSON_COMPLETE = "{\"short_message\":\"foo\",\"full_message\":\"foo\nzomg\",\"facility\":"
            + "\"test\",\"level\":3,\"line\":23,\"file\":\"lol.js\",\"host\":\"bar\",\"timestamp\": " + usedTimestamp + ",\"_lol_utf8\":\"ü\",\"_foo\":\"bar\"}";
    public final static String GELF_JSON_INCOMPLETE = "{\"short_message\":\"foo\",\"host\":\"bar\"}";
    public final static String GELF_JSON_INCOMPLETE_WITH_ID = "{\"short_message\":\"foo\",\"host\":\"bar\",\"_id\":\":7\",\"_something\":\"foo\"}";
    public final static String GELF_JSON_WITH_MAP = "{\"short_message\":\"foo\",\"host\":\"bar\",\"_lol\":{\"foo\":\"zomg\"}}";

    @Test
    public void testMessageReceived() throws Exception {
        GraylogServerStub serverStub = new GraylogServerStub();
        GELFProcessor processor = new GELFProcessor(serverStub);

        processor.messageReceived(new GELFMessage(TestHelper.zlibCompress(GELF_JSON_COMPLETE)), null);
        processor.messageReceived(new GELFMessage(TestHelper.gzipCompress(GELF_JSON_COMPLETE)), null);
        // All GELF types are tested in GELFMessageTest.

        Message lm = serverStub.lastInsertedToProcessBuffer;

        assertEquals(2, serverStub.callsToProcessBufferInserter);
        assertEquals("foo", lm.getField("message"));
        assertEquals("foo\nzomg", lm.getField("full_message"));
        assertEquals("test", lm.getField("facility"));
        assertEquals(3L, lm.getField("level"));
        assertEquals("bar", lm.getField("source"));
        assertEquals("lol.js", lm.getField("file"));
        assertEquals(23L, lm.getField("line"));
        assertEquals(Tools.dateTimeFromDouble(usedTimestamp), lm.getField("timestamp"));
        assertEquals("ü", lm.getField("lol_utf8"));
        assertEquals("bar", lm.getField("foo"));
        assertEquals(11, lm.getFields().size());
    }

    @Test
    public void testMessageReceivedSetsCreatedAtToNowIfNotSet() throws Exception {
        GraylogServerStub serverStub = new GraylogServerStub();
        GELFProcessor processor = new GELFProcessor(serverStub);

        processor.messageReceived(new GELFMessage(TestHelper.zlibCompress(GELF_JSON_INCOMPLETE)), null);
        // All GELF types are tested in GELFMessageTest.

        Message lm = serverStub.lastInsertedToProcessBuffer;

        assertEquals(1, serverStub.callsToProcessBufferInserter);

        // This or the last second is fine.
        int messageSecond = ((DateTime) lm.getField("timestamp")).secondOfMinute().get();
        assert(DateTime.now().secondOfMinute().get() == messageSecond || DateTime.now().secondOfMinute().get() == messageSecond-1);
    }

    @Test
    public void testMessageReceivedSkipsSettingIDField() throws Exception {
        GraylogServerStub serverStub = new GraylogServerStub();
        GELFProcessor processor = new GELFProcessor(serverStub);

        processor.messageReceived(new GELFMessage(TestHelper.zlibCompress(GELF_JSON_INCOMPLETE_WITH_ID)), null);
        // All GELF types are tested in GELFMessageTest.

        Message lm = serverStub.lastInsertedToProcessBuffer;

        assertEquals(1, serverStub.callsToProcessBufferInserter);
        assertNotEquals(7, lm.getField("_id"));
        assertEquals("foo", lm.getField("something"));
        assertEquals(6, lm.getFields().size());
    }
    
    @Test
    public void testMessageReceivedConvertsMapsToString() throws Exception {
        GraylogServerStub serverStub = new GraylogServerStub();
        GELFProcessor processor = new GELFProcessor(serverStub);

        processor.messageReceived(new GELFMessage(TestHelper.zlibCompress(GELF_JSON_WITH_MAP)), null);
        // All GELF types are tested in GELFMessageTest.

        Message lm = serverStub.lastInsertedToProcessBuffer;

        assertEquals(1, serverStub.callsToProcessBufferInserter);
        assertEquals("{\"foo\":\"zomg\"}", lm.getField("lol"));
        assertEquals(5, lm.getFields().size());
    }
}