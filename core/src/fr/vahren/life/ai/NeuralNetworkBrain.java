package fr.vahren.life.ai;

import org.deeplearning4j.rl4j.learning.sync.qlearning.QLearning;
import org.deeplearning4j.rl4j.learning.sync.qlearning.discrete.QLearningDiscreteConv;
import org.deeplearning4j.rl4j.learning.sync.qlearning.discrete.QLearningDiscreteDense;
import org.deeplearning4j.rl4j.network.dqn.DQNFactory;
import org.deeplearning4j.rl4j.network.dqn.DQNFactoryStdDense;
import org.deeplearning4j.rl4j.policy.DQNPolicy;
import org.deeplearning4j.rl4j.space.Box;
import org.deeplearning4j.rl4j.util.DataManager;

import java.io.IOException;

public abstract class NeuralNetworkBrain<I,O> extends Brain<I,O> {

    public static QLearning.QLConfiguration QL =
            new QLearning.QLConfiguration(
                    123,    //Random seed
                    200,    //Max step By epoch
                    150000, //Max step
                    150000, //Max size of experience replay
                    32,     //size of batches
                    500,    //target update (hard)
                    10,     //num step noop warmup
                    0.01,   //reward scaling
                    0.99,   //gamma
                    1.0,    //td-error clipping
                    0.1f,   //min epsilon
                    1000,   //num step for eps greedy anneal
                    true    //double DQN
            );

    public static DQNFactoryStdDense.Configuration NET =
            DQNFactoryStdDense.Configuration.builder()
                    .l2(0.001).learningRate(0.0005).numHiddenNodes(16).numLayer(3).build();

    private void initNetwork() throws IOException {
        DataManager manager = new DataManager(true);

        LifeMDP mdp = new LifeMDP();

        QLearningDiscreteDense<State> learning = new QLearningDiscreteDense<>(mdp,NET,QL,manager);

        learning.train();

        DQNPolicy<State> policy = learning.getPolicy();

    }

}
