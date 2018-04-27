package com.mobileai.luncert.core.chat.interfaces;

import java.util.Map;

public interface TeamManager {

    public Map<Integer, String> queryTeam();

    /**
     * max name length = 40
     */
    public int createTeam(String name);

    public Team joinTeam(int groupId, User user) throws Exception;

}