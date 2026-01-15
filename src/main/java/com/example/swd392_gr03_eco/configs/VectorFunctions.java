package com.example.swd392_gr03_eco.configs;

public class VectorFunctions {
    public static double cosineDistance(Object a, Object b) {
        if (a == null || b == null) {
            return 1.0;
        }
        float[] vecA = (float[]) a;
        float[] vecB = (float[]) b;
        double dotProduct = 0.0;
        double normA = 0.0;
        double normB = 0.0;
        for (int i = 0; i < vecA.length; i++) {
            dotProduct += vecA[i] * vecB[i];
            normA += Math.pow(vecA[i], 2);
            normB += Math.pow(vecB[i], 2);
        }
        if (normA == 0 || normB == 0) {
            return 1.0;
        }
        return 1.0 - (dotProduct / (Math.sqrt(normA) * Math.sqrt(normB)));
    }
}
